from rest_framework.pagination import PageNumberPagination


class ReelsPagination(PageNumberPagination):
    """Custom pagination for reels with page_size=10"""
    page_size = 10
    page_size_query_param = 'page_size'
    max_page_size = 50
