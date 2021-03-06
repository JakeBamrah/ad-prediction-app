import numpy as np
import torch
from torch.autograd import Variable

import argparse

from data import DataGenerator


parser = argparse.ArgumentParser(description='AMGNN')
parser.add_argument('--test_N_way', type=int, default=3, metavar='N')
parser.add_argument('--test_N_shots', type=int, default=10, metavar='N')
parser.add_argument('--cuda', action='store_true', default=False,
                    help='enables CUDA training')
parser.add_argument('--clinical_feature_num', type=int, default=5, metavar='N',
                    help='clinical feature number of one sample')

args = parser.parse_args()
args.cuda = args.cuda and torch.cuda.is_available()


class Predict():
    """
        Provides methods for making Alzheimer's disease predictions on
        a group basis (supervised) and an individual basis (semi-unsupervised)
    """
    def __init__(self, amgnn, classifier_module):
        self.amgnn = amgnn
        self.classifier_module = classifier_module
        self.args = args

        # hack best_model args
        self.amgnn.args.cuda = False

    def predict_nodes_using_one_shot(self, data):
        """Predict patient Alzheimer's prognosis based on data provided from Generator class"""
        pre_all = []
        pre_all_num = []
        real_all = []

        [x_t, labels_x_cpu_t, _, _, xi_s, labels_yi_cpu, oracles_yi] = data

        z_clinical = x_t[:, 0, 0, 0:self.args.clinical_feature_num]
        zi_s_clinical = [batch_xi[:, 0, 0, 0:self.args.clinical_feature_num] for batch_xi in xi_s]

        z_mri_feature = x_t[:, :, :, self.args.clinical_feature_num:]
        zi_s_mri_feature = [batch_xi[:, :, :,self.args.clinical_feature_num:] for batch_xi in xi_s]

        adj = self.amgnn.compute_adj(z_clinical, zi_s_clinical)

        x = x_t
        labels_x_cpu = labels_x_cpu_t

        if self.args.cuda:
            xi_s = [batch_xi.cuda() for batch_xi in zi_s_mri_feature]
            labels_yi = [label_yi.cuda() for label_yi in labels_yi_cpu]
            oracles_yi = [oracle_yi.cuda() for oracle_yi in oracles_yi]
            x = x.cuda()
        else:
            labels_yi = labels_yi_cpu

        xi_s = [Variable(batch_xi) for batch_xi in zi_s_mri_feature]
        labels_yi = [Variable(label_yi) for label_yi in labels_yi]
        oracles_yi = [Variable(oracle_yi) for oracle_yi in oracles_yi]
        z_mri_feature = Variable(z_mri_feature)

        # compute metric from embeddings
        inputs = [z_clinical, z_mri_feature, zi_s_clinical, xi_s, labels_yi, oracles_yi, adj]
        *rest, out_logits = self.amgnn(*inputs)
        Y = self.classifier_module.forward(out_logits)
        y_pred = self.classifier_module.forward(out_logits)

        y_pred = y_pred.data.cpu().numpy()
        y_inter = [list(y_i) for y_i in y_pred]
        pre_all_num = pre_all_num + list(y_inter)
        y_pred = np.argmax(y_pred, axis=1)
        labels_x_cpu = labels_x_cpu.cpu().numpy()
        labels_x_cpu = np.argmax(labels_x_cpu, axis=1)
        pre_all = pre_all+list(y_pred)
        real_all = real_all + list(labels_x_cpu)

        print('real_label:  '+str(real_all))
        print('pre_all:  '+str(pre_all))
        print('pre_all_num:  '+str(pre_all_num))

        return Y, y_pred, labels_x_cpu

    def predict_node_using_one_shot(self, data_dict, unlabelled_node, sample_size=64):
        """
            Predict AD diagnosis for a single patient using neighbours of GNN.
            Returns prediction, original node and the samples used.
            All nodes are returned in torch.tensor format with shape:
                array([[numpy.float64, ...]])
        """
        loader = DataGenerator(data=data_dict)
        data = loader.get_task_batch(
                batch_size=sample_size,
                n_way=self.args.test_N_way,
                num_shots=self.args.test_N_shots,
                unlabelled_node=unlabelled_node,
                cuda = self.args.cuda
        )

        [batch_x, *rest] = data
        _, y_pred, actual_labels = self.predict_nodes_using_one_shot(data)

        # separate predicted node and labelled nodes
        samples = torch.as_tensor(batch_x[:-1])
        sample_labels = actual_labels[:-1]

        # export unlabelled node in correct format
        unlabelled_node = torch.as_tensor(unlabelled_node[0])
        node_predicted_label = y_pred[-1]

        return node_predicted_label, unlabelled_node, samples, sample_labels
