from indexing import create_indexes
from db import get_db_connection
import time

def measure_query_time(query, books_collection, iterations=5):
    total_time = 0
    for _ in range(iterations):
        start_time = time.time()
        results = list(books_collection.find(query))  # Execute the query
        end_time = time.time()
        print(f"Documents matched: {len(results)}")  # Debugging info
        total_time += (end_time - start_time)
    return total_time / iterations

def compare_performance_index_benefit():
    db = get_db_connection()
    books_collection = db['books']

    # Define a query that benefits from an index
    sample_query = {"title": {"$regex": "^P", "$options": "i"}}  #Search for titles starting with 'P'
    #sample_query = {} //this is test case for querying all books in the collection

    # Measure performance without indexes
    print("Measuring performance without indexes for filtered query(titles starting with the letter P)")
    no_index_time = measure_query_time(sample_query, books_collection)
    print(f"Average query time without indexes: {no_index_time:.6f} seconds")

    # Create indexes
    create_indexes()

    # Measure performance with indexes
    print("Measuring performance with indexes for filtered query...")
    with_index_time = measure_query_time(sample_query, books_collection)
    print(f"Average query time with indexes: {with_index_time:.6f} seconds")

    # Compare results
    improvement = no_index_time / with_index_time if with_index_time > 0 else float('inf')
    print(f"Performance improvement: {improvement:.2f}x faster with indexes")

if __name__ == "__main__":
    compare_performance_index_benefit()
