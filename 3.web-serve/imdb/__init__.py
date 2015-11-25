from common import *

info_type_ids = {
        "genres": 3,
        "countries": 8
}

def get_similarity(attribute):
    db = connect('imdb')
    if attribute in info_type_ids:
        id = info_type_ids[attribute]
        stream = stream_movie_info(db, id)
        sim, size = fast_jaccard(stream)
        db.close()
        return sim, size
    else:
        db.close()
        raise Exception("Unknown attribute")
