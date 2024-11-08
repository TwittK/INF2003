import pandas as pd

# Load the dataset
data = pd.read_csv('bulk_bookstore_dataset.csv')

# Define the columns you want to keep
columns_to_keep = ['Title', 'Url', 'Price', 'ISBN-10', 'ISBN', 'Author', 'Format', 'Pages', 'Publisher', 'Language']

# Select only the columns you wish to keep
data = data[columns_to_keep]

# Verify the columns
print("Columns after selection:", data.columns)

# Fix encoding issues: Strip b'' from strings
data['Title'] = data['Title'].apply(lambda x: x[2:-1])

# Convert price to float
data['Price'] = data['Price'].replace('[\$,]', '', regex=True).astype(float)

# Handle missing values: Drop or fill (example: fill with median)
data['Pages'].fillna(data['Pages'].median(), inplace=True)

# Extract dimensions into separate columns (assuming 'Dimensions' column is like '6" x 9" x 0.19"')
#data[['Width', 'Height', 'Depth']] = data['Dimensions'].str.extract('(\d*\.?\d*)"\s*x\s*(\d*\.?\d*)"\s*x\s*(\d*\.?\d*)"')

# Convert 'Scraped at' to datetime
#data['Scraped at'] = pd.to_datetime(data['Scraped at'])

# Save the cleaned data
data.to_csv('cleaned_bulk_bookstore_dataset.csv', index=False)
