import numpy as np
from sklearn.linear_model import LinearRegression

def linear_regression_example():
    X = np.array([[1], [2], [3], [4]])
    y = np.array([2, 4, 6, 8])
    model = LinearRegression().fit(X, y)
    return model.coef_[0], model.intercept_

# Пример:
coef, intercept = linear_regression_example()
print(f"10. Линейная регрессия: y = {coef:.2f}x + {intercept:.2f}")
