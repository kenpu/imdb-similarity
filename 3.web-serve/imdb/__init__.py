from common import *
import time

info_type_ids = {
        "genres": 3,
        "countries": 8
}

mem_cache = dict()

def cache_checkin(key, value):
    mem_cache[key] = dict(t=time.time(), value=value)
    return value

def cache_checkout(key, expiration=3600):
    if key in mem_cache:
        entry = mem_cache.get(key)
        t = time.time()
        if t - entry["t"] > expiration:
            print "Cache miss %.2f - %.2f for %s" % (entry["t"], t, key)
            raise Exception("Expired")
        else:
            print "Cache hit %.2f - %.2f for %s" % (entry["t"], t, key)
            return entry["value"]
    else:
        raise Exception("Not cached")

def get_similarity_from_db(attribute):
    db = connect('imdb')
    err = None
    if attribute in info_type_ids:
        id = info_type_ids[attribute]
        stream = stream_movie_info(db, id)
        sim, size = fast_jaccard(stream)
        db.close()
    else:
        db.close()
        err = Exception("Unknown attribute")

    if err:
        raise err
    else:
        return sim, size

def get_similarity(attribute, cache=False):
    sim = None
    size = None
    err = None

    if not cache:
        return get_similarity_from_db(attribute)
    else:
        key = "similarity__%s" % attribute
        try:
            return cache_checkout(key)
        except Exception, e:
            sim, size = get_similarity_from_db(attribute)
            return cache_checkin(key, (sim, size))

