try:
    import cv2
    def edge_detection(image_path):
        image = cv2.imread(image_path, cv2.IMREAD_GRAYSCALE)
        edges = cv2.Canny(image, 100, 200)
        cv2.imwrite('edges.png', edges)
        return 'edges.png'
    # Пример:
    # print("14. Границы сохранены в:", edge_detection('input.jpg'))
except ImportError:
    print("14. OpenCV не установлен")
