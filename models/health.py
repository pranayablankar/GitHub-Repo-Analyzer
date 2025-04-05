# import pandas as pd
# from sklearn.model_selection import train_test_split
# from sklearn.preprocessing import StandardScaler
# from sklearn.svm import SVR
# from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

# # Sample data for repository metrics
# data = {
#     'issue_resolution_time': [5, 10, 3, 8, 6],  # in days
#     'pr_merge_frequency': [15, 20, 10, 25, 30],  # number of merges in the last month
#     'star_growth_rate': [2, 5, 1, 3, 4],  # stars added in the last month
#     'contributor_retention': [80, 60, 90, 70, 50],  # percentage of active contributors
#     'health_ratio': [75, 60, 85, 70, 65]  # target variable (health ratio)
# }

# # Create a DataFrame
# df = pd.DataFrame(data)

# # Features and target variable
# X = df[['issue_resolution_time', 'pr_merge_frequency', 'star_growth_rate', 'contributor_retention']]
# y = df['health_ratio']

# # Step 2: Split Data
# X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# # Step 3: Train the SVR Model
# # Standardize the features
# scaler = StandardScaler()
# X_train_scaled = scaler.fit_transform(X_train)
# X_test_scaled = scaler.transform(X_test)

# # Create and fit the SVR model
# svr_model = SVR(kernel='rbf', C=1.0, epsilon=0.1)
# svr_model.fit(X_train_scaled, y_train)

# # Step 4: Make Predictions
# y_pred = svr_model.predict(X_test_scaled)

# # Step 5: Evaluate the Model
# mae = mean_absolute_error(y_test, y_pred)
# mse = mean_squared_error(y_test, y_pred)
# r2 = r2_score(y_test, y_pred)

# print("Predictions:", y_pred)
# print("Mean Absolute Error:", mae)
# print("Mean Squared Error:", mse)
# print("R-squared:", r2)