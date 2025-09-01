'''
backend first task
'''

import random as r
from typing import Callable
import functools
import time
import json
import hashlib

def read_file(file_path: str) -> dict:
    '''
    reads json
    '''
    with open(file_path, 'r', encoding='utf-8') as file:
        data = json.load(file)
        data = {data[i]['name']: [data[i]['access_right'], data[i]['password']] for i in range(len(data))}
    return data

def logging_before(func: Callable) -> Callable:
    '''
    decorator called before using func
    '''
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        all_args = list(args)
        all_kwargs = list(kwargs.values())
        print(f"CALLING {func.__name__}: ARGS={all_args if all_args else '...'}, KWARGS={all_kwargs if list(args) else '...'}")
        return func(*args, **kwargs)
    return wrapper

def logging_after(func: Callable) -> Callable:
    '''
    decorator called after using func
    '''
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        print(f"PROCESSED {func.__name__}: RESULT={result if result else '...'}")
        return result
    return wrapper

def timer(func: Callable) -> Callable:
    '''
    decorator that measures time of func exec
    '''
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        start = time.time()
        result = func(*args, **kwargs)
        end = time.time()
        print(f"TIMER LOG: {func.__name__} took {(end - start):.6f} seconds")
        return result
    return wrapper

def sort_result(func: Callable) -> Callable:
    '''
    decorator that sorts get_shuffled_alphabet result
    '''
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        result = func(*args, **kwargs)
        result.sort()
        return result
    return wrapper

def access_required(func: Callable, access_right: str = 'admin') -> Callable:
    '''
    decorator that checks access rights
    '''
    user_data = read_file('names.json')
    @functools.wraps(func)
    def wrapper(*args, **kwargs):
        try:
            input_name = input("Enter your name: ")
            input_password = input("Enter your password: ")
            input_password = hashlib.sha256(input_password.encode()).hexdigest()
            if (user_data.get(input_name)[0] == access_right) and (user_data.get(input_name)[1] == input_password):
                return func(*args, **kwargs)
            else:
                raise PermissionError("Access denied")
        except Exception as error:
            raise PermissionError("Access denied") from error
    return wrapper

@logging_before
@logging_after
@timer
@access_required
@sort_result
def get_shuffled_alphabet() -> list[str]:
    '''
    lowercase alphabet shuffler
    '''
    alphabet = [chr(i) for i in range(97, 123)]
    r.shuffle(alphabet)
    return alphabet

if __name__ == "__main__":
    get_shuffled_alphabet()
    # for testing purposes, password is mypassword for everyone