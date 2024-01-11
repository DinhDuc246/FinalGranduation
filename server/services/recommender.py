import sys
import json
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import linear_kernel

lines = sys.stdin.readlines()
movie_id = json.loads(lines[0])
movie_data = json.loads(lines[1])
# Convert JSON data to DataFrame
movies = pd.DataFrame(movie_data)
# Combine relevant information into a feature representation for each movie
# Kết hợp thông tin liên quan thành biểu diễn đặc điểm cho mỗi phim
movies['combined_features'] = movies.apply(lambda row: ' '.join(row['genres']) + ' ' + row['country'], axis=1)
# Create a feature representation for each movie using TF-IDF
# Tạo biểu diễn đặc trưng cho từng phim bằng TF-IDF
tfidf_vectorizer = TfidfVectorizer()
tfidf_matrix = tfidf_vectorizer.fit_transform(movies['combined_features'])
# Compute the cosine similarity between movies based on their features
# Tính độ tương đồng cosine giữa các phim dựa trên đặc điểm của chúng
cosine_sim = linear_kernel(tfidf_matrix, tfidf_matrix)
# Hàm để đề xuất các mục dựa trên một mục đầu vào và trả lại dưới dạng danh sách
def get_recommendations(item_id, cosine_sim=cosine_sim):
    idx = movies.index[movies['_id'] == item_id].tolist()[0]
    filter_scores = []
    sim_scores = list(enumerate(cosine_sim[idx]))
    for score in sim_scores:
        if score[1] > 0:
            filter_scores.append(score)
    filter_scores = sorted(filter_scores, key=lambda x: x[1], reverse=True)
    filter_scores = filter_scores[1:11]  # Lấy 10 mục tương tự (loại bỏ mục hiện tại)
    item_indices = [i[0] for i in filter_scores]
    item_ids = movies['_id'].iloc[item_indices].tolist()
    # Sử dụng list comprehension để tìm các đối tượng tương ứng
    items = [item for item in movie_data if item['_id'] in item_ids if item['_id'] != item_id]
    return items
# Get movie recommendations for a specific movie ID
recommendations = get_recommendations(movie_id)
print(json.dumps(recommendations, ensure_ascii=False))




