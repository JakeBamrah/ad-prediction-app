import torch
import numpy as np
import pandas as pd
import umap

import json
from collections import defaultdict
import logging

from predict import Predict
from gnn_models import SoftmaxModule


PREDICT_COLS = {
        'ADAS_TOTAL', 'AD_LABEL',
        'AGE', 'CBB_SCORE_%', 'CDR',
        'COMP_EXEC_FUNC_SCORE',
        'COMP_MEM_SCORE', 'FATHDEM',
        'LOG_MEM_DEL_TOTAL',
        'LOG_MEM_IMM_TOTAL',
        'MMSE', 'MODHACH_SCORE',
        'MOTHDEM', 'NPITOTAL',
        'PHC_EXF', 'PHC_LAN',
        'PHC_MEM', 'PTEDUCAT',
        'PTGENDER'}
EXCLUDE_COLS = {'RID', 'AD_LABEL', 'CDR'}
BEST_MODEL = 'amgnn_best_model.pkl'

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def fill_patient_details(patient_to_predict, df, predict_cols):
    """Fill in MRI columns using a similar patient for a given patient."""
    cols_to_replace = predict_cols - EXCLUDE_COLS
    reduced = df[cols_to_replace]

    # NOTE: make sure columns are in the same order as reduced df
    patient_to_predict = [patient_to_predict[k] for k in cols_to_replace]
    patient_to_predict = np.array(patient_to_predict)
    diff = reduced - patient_to_predict
    norm_df = diff.apply(np.linalg.norm, axis=1)
    id = reduced.loc[norm_df.idxmin(skipna=True), :].name

    # duplicate similar row and replace with patient to predict values
    # we now have a row that can be used to predict
    p = dict(zip(cols_to_replace, patient_to_predict))
    new_row = df.loc[id, :].copy()
    for k,v in p.items():
        new_row[k] = v

    return {'new_patient_idx': len(df - 1), 'patient': new_row}

def min_max_norm(df, cols_to_exclude=EXCLUDE_COLS):
    """Normalize dataframe for a set of columns."""
    cols_to_normalize = [c for c in df.columns if c  not in cols_to_exclude]
    df = df.loc[:, cols_to_normalize]

    negative_cols = [k for k,v in df.items() if v.min() < 0]
    df[negative_cols] = df[negative_cols] + abs(df[negative_cols].min())

    numer = df - df.min()
    denom = df.max() - df.min()
    df = (numer / denom)
    return df.fillna(0)

def format_df_for_graph(df):
    np_arr = np.expand_dims(df.to_numpy(), axis=1)
    np_arr = np.nan_to_num(np_arr)
    return np_arr

def create_umap_embeddings(df):
    """Dimensionally reduce dataframe into UMAP embeddings for visualization."""
    SEED = 1092
    clusterable_embedding = umap.UMAP(
        n_neighbors=5,
        min_dist=0.0,
        n_components=3,
        random_state=SEED
    )
    clusterable_embedding.fit_transform(df)
    embeddings = clusterable_embedding.embedding_
    return embeddings


def handler(event, context):
    """Lambda handler providing node prediction."""
    # NOTE: make sure keys in patient_to_label match PREDICT_COLS
    try:
        patient_to_label = event['patient_to_label']
        sample_size = event.get('sample_size', 64)

        logger.info(f'Predicting for node: {str(event)}')
    except KeyError:
        logger.debug(f"Unable to parse body {str(event)}")
        return { 'statusCode': 501, 'body': f"Event not working: {event}" }

    if not patient_to_label:
        return { 'statusCode': 501 }

    # find similar patient from samples and fill in MRI cols
    df = pd.read_csv('combined.csv')
    filled_p = fill_patient_details(patient_to_label, df, PREDICT_COLS)

    # patient to predict will always be last row
    df = df.append(filled_p['patient'], ignore_index=True)

    norm_df = min_max_norm(df)
    np_arr = format_df_for_graph(norm_df)
    unlabelled_node = np_arr[-1]

    # re-organise data for dataloader
    data_dict = defaultdict(list)
    for i, subj in enumerate(np_arr):
        key = int(df['AD_LABEL'][i]) - 1
        data_dict[key].append(subj)

    logger.info(f'Predicting for node: {unlabelled_node}')

    # make prediction for the given subject
    amgnn = torch.load(BEST_MODEL, torch.device('cpu'))
    softmax_module = SoftmaxModule()
    predict = Predict(amgnn, softmax_module)
    results = predict.predict_node_using_one_shot(
        data_dict,
        unlabelled_node=unlabelled_node,
        sample_size=sample_size
    )
    pred_label, *rest = results

    # update unlablled patient with predicted label
    df.loc[len(df) - 1, 'AD_LABEL'] = pred_label

    umap_embeddings = create_umap_embeddings(norm_df)

    logger.info(f'\
            predicted_label: {pred_label},\
            umap_embeddings: {umap_embeddings}'
            )
    return {
            'predicted_label': int(pred_label),
            'df': df[PREDICT_COLS].to_json(orient='records'),
            'umap_embeddings': umap_embeddings.tolist()
            }
