import torch
import numpy as np
import pandas as pd

import json
from collections import defaultdict

from predict import Predict
from gnn_models import SoftmaxModule


PREDICT_COLS = {
    'AGE', 'PTGENDER', 'PTEDUCAT',
    'MOTHDEM', 'FATHDEM', 'PHC_MEM',
    'PHC_EXF', 'PHC_LAN', 'AD_LABEL',
    'ADAS_TOTAL', 'CBB_SCORE_%',
    'CDR', 'MMSE', 'MODHACH_SCORE',
    'NPITOTAL', 'LOG_MEM_IMM_TOTAL',
    'LOG_MEM_DEL_TOTAL', 'COMP_MEM_SCORE',
    'COMP_EXEC_FUNC_SCORE'}
EXCLUDE_COLS = {'RID', 'AD_LABEL', 'CDR'}
DATA_ROOT = 'data'
BEST_MODEL = 'data/amgnn_best_model.pkl'


def fill_patient_details(patient_to_predict, df, predict_cols):
    cols_to_use = predict_cols - EXCLUDE_COLS

    reduced = df[cols_to_use]

    # NOTE: make sure columns are in the same order as reduced df
    patient_to_predict = [patient_to_predict[k] for k in cols_to_use]
    patient_to_predict = np.array(patient_to_predict)

    diff = reduced - patient_to_predict
    norm_df = diff.apply(np.linalg.norm, axis=1)
    id = reduced.loc[norm_df.idxmin(skipna=True), :].name

    # duplicate similar row and replace with patient to predict values
    # we now have a row that can be used to predict
    p = dict(zip(cols_to_use, patient_to_predict))
    new_row = df.loc[id, :].copy()
    for k,v in p.items():
        new_row[k] = v

    return {'new_patient_idx': len(df - 1), 'patient': new_row}

def min_max_norm(df, cols_to_exclude=EXCLUDE_COLS):
    """Normalize patient according to existing patient set."""
    negative_cols = [k for k,v in df.items() if v.min() < 0]
    df[negative_cols] = df[negative_cols] + abs(df[negative_cols].min())

    cols_to_normalize = [c for c in df.columns if c  not in cols_to_exclude]
    normalized_df = df[cols_to_normalize]
    numer = normalized_df - normalized_df.min()
    denom = normalized_df.max() - normalized_df.min()
    df[cols_to_normalize] = (numer / denom)

    return df[cols_to_normalize]

def format_df_for_graph(df):
    np_arr = np.expand_dims(df.to_numpy(), axis=1)
    np_arr = np.nan_to_num(np_arr)
    return np_arr

def draw_umap_graph(features):
    # TODO: Use pred_feat and pred_feat_samples to draw umap graph
    pass

# https://aws.amazon.com/blogs/machine-learning/using-container-images-to-run-pytorch-models-in-aws-lambda/
def lambda_handler(event, context):
    """ Lambda handler for providing node prediction """
    # NOTE: make sure keys in patient_to_label match PREDICT_COLS
    body = json.loads(event['body'])
    patient_to_label = body['patient_to_label']
    sample_size = body.get('sample_size', 64)
    # sample_size = 64
    # patient_to_label = {
    #     'PHC_MEM': 1.173,
    #     'MODHACH_SCORE': 0.0,
    #     'FATHDEM': 0.0,
    #     'NPITOTAL': 0.0,
    #     'MOTHDEM': 0.0,
    #     'PTGENDER': 2.0,
    #     'ADAS_TOTAL': 30.0,
    #     'LOG_MEM_IMM_TOTAL': 15.0,
    #     'PTEDUCAT': 18.0,
    #     'AGE': 84.8186,
    #     'MMSE': 30.0,
    #     'COMP_MEM_SCORE': 2.033,
    #     'COMP_EXEC_FUNC_SCORE': 0.574,
    #     'LOG_MEM_DEL_TOTAL': 11.0,
    #     'CBB_SCORE_%': 83.44298245614036,
    #     'PHC_EXF': -0.15000001,
    #     'PHC_LAN': 0.66600001
    # }

    # find similar patient from samples and fill in missing points
    df = pd.read_csv(f'{DATA_ROOT}/combined.csv')
    filled_p = fill_patient_details(patient_to_label, df, PREDICT_COLS)

    # patient to predict will always be last row
    df = df.append(filled_p['patient'], ignore_index=True)
    norm_df = min_max_norm(df)
    np_arr = format_df_for_graph(norm_df)
    unlabelled_node = np_arr[-1]

    # prepare data for dataloader
    # you now know the order of the columns so you can reverse the min-max
    keys = ['CN', 'MCI', 'AD' ]
    data_dict = defaultdict(list)
    for i, subj in enumerate(np_arr):
        key = int(df['AD_LABEL'][i]) - 1
        data_dict[keys[key]].append(subj)

    # make prediction for the given subject
    amgnn = torch.load(BEST_MODEL, torch.device('cpu'))
    softmax_module = SoftmaxModule()
    predict = Predict(amgnn, softmax_module)
    results = predict.predict_node_using_one_shot(
        data_dict,
        unlabelled_node=unlabelled_node,
        sample_size=sample_size
    )

    pred_label, pred_feat, sample_features, sample_labels = results

    # TODO: join pred_feat and sample_features to provide umap points
    # join pred_label and sample_lables
    # map umap points to labels
    # draw umap points on frontend js

    # have a look Aquis lambda docker file

    return {
        'statusCode': 200,
        'body': json.dumps({
            'predicted_label': pred_label,
            'predicted_sam_labels': list(sample_labels),
        })
    }
