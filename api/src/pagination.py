# {
#     "links": {
#         "next": "null",
#         "previous": "null"
#     },
#     "count": 3,
#     "pages": 1,
#     "page_size": 15,
#     "extra": {},
#     "items": [
#         {
#             "id": 3,
#             "created_at": "2022-06-28T13:27:13.708274",
#             "updated_at": "2022-06-28T13:27:13.708299",
#             "rate": 1,
#             "improves": [
#                 "Đội ngũ hỗ trợ nhiệt tình",
#                 "chuyên nghiệp (CV hợp tác bác sĩ",
#                 "Sales tại viện)"
#             ],
#             "other": "",
#             "staff": 2,
#             "doctor": 2,
#             "rater": "Doctor 2"
#         }
#     ]
# }

from fastapi import Response
from math import ceil


def paginate_response(
    data, total_data_count: int, page_num: int = 1, page_size: int = 10
):

    extra = {}
    items = []
    if isinstance(data, dict):
        items = data.get("items", [])
        extra = data.get("extra", {})
    else:
        start = (page_num - 1) * page_size
        end = start + page_size
        items = data[start:end]

    if end > total_data_count:
        next_link = None

        if page_num > 1:
            previous_link = f"/user?page_num={page_num - 1}&page_size={page_size}"
        else:
            previous_link = None
    else:
        if page_num > 1:
            previous_link = f"/user?page_num={page_num - 1}&page_size={page_size}"
        else:
            previous_link = None

        next_link = f"/user?page_num={page_num + 1}&page_size={page_size}"

    return {
        "links": {"next": next_link, "previous": previous_link},
        "count": total_data_count,
        "page_num": page_num,
        "pages": ceil(total_data_count / page_size),
        "page_size": page_size,
        "extra": extra,
        "items": items,
    }
