from sklearn.neighbors import KNeighborsClassifier

def knn_example():
    X = [[0], [1], [2], [3]]
    y = [0, 0, 1, 1]
    model = KNeighborsClassifier(n_neighbors=3)
    model.fit(X, y)
    return model.predict([[1.1]])

# Пример:
print("15. KNN предсказание для [1.1]:", knn_example())
