'''
pandas, numpy and openpyxl tasks
'''

import pandas as pd
import numpy as np
import openpyxl as op

def read_file(filename: str) -> pd.DataFrame:
    '''
    read file and return dataframe
    '''
    with open(filename, 'r', encoding='utf-8') as file:
        df = pd.read_csv(file)
    return df

def sum_of_columns_and_rows(df: pd.DataFrame) -> pd.DataFrame:
    '''
    adds row of sum of each column and column of sum of each row
    '''
    df.loc['Total for columns'] = df.sum(axis=0)
    df['Total for rows'] = df.sum(axis=1)
    return df

def find_numbers_div_by_number(df: pd.DataFrame, number: int) -> np.array:
    '''
    finds number divisible by 5 and returns them and their positions
    '''
    df = df.to_numpy()
    rows, cols = np.where(df % number == 0)
    numbers = [(df[r, c], r, c) for r, c in zip(rows, cols)]
    return numbers

def find_number(df: pd.DataFrame, number: int) -> np.array:
    '''
    finds number in dataframe and returns its positions
    '''
    df = df.to_numpy()
    rows, cols = np.where(df == number)
    positions = [(r, c) for r, c in zip(rows, cols)]
    return positions

def sort_numbers(df: pd.DataFrame) -> pd.DataFrame:
    '''
    sorts numbers in a dataframe in ascending order
    '''
    df_copy = df.copy()
    df_copy = df_copy.to_numpy()
    sorted_numbers = np.sort(df_copy, axis=None)
    sorted_df = pd.DataFrame(sorted_numbers.reshape(df.shape), columns=df.columns)
    sorted_df.to_excel('sorted_numbers.xlsx', engine='openpyxl', index=False)
    return sorted_df

def numbers_to_letters(df: pd.DataFrame) -> pd.DataFrame:
    '''
    replaces numbers with corresponding letters (1 -> A, 2 -> B, ..., 26 -> Z)
    '''
    df_copy = df.copy()
    df_copy = df_copy.to_numpy()
    letters = np.vectorize(lambda x: x)(df_copy).flatten().astype(object)
    len_df = len(letters)
    for i in range(len_df):
        n = letters[i]
        result = ''
        while n > 0:
            n, remainder = divmod(n - 1, 26)
            result = chr(97 + remainder) + result
        letters[i] = result
    letters_df = letters.reshape(df.shape)
    letters_df = pd.DataFrame(letters_df, columns=df.columns)
    letters_df.to_csv('numbers_to_letters.csv', index=False)
    return letters_df
    
if __name__ == "__main__":
    df = read_file('random_numbers.csv')
    print('\nStarting DataFrame:\n')
    print(df)
    df_sums = df.copy()
    print('\n1. Sum of columns and rows:\n')
    print(sum_of_columns_and_rows(df_sums))
    print('\n2.1 Numbers divisible by 5 and their locations (number, row, column):\n')
    print(find_numbers_div_by_number(df, 5))
    print('\n2.2 Locations of number 42 (row, column):\n')
    print(find_number(df, 42))
    print('\n3. Sorted DataFrame:\n')
    print(sort_numbers(df))
    print('\nAdditional task:\n')
    print(numbers_to_letters(df))
