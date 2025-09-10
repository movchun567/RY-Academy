import pandas as pd
import numpy as np

def generate_random_matrix():
    numbers = np.random.permutation(np.arange(1, 101))
    df = pd.DataFrame(
        numbers.reshape(10, 10),
        columns=[f"Стовпчик {i + 1}" for i in range(10)]
    )
    df.to_csv("random_numbers.csv", index=False)


generate_random_matrix()
