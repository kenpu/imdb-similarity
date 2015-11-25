import psycopg2 as pg
from itertools import groupby
from collections import defaultdict

GENRES_INFO_TYPE_ID = 3
COUNTRY_INFO_TYPE_ID = 51

def connect(dbname):
    return pg.connect("dbname='%s'" % dbname)

def stream_tuples(conn, sql, args):
    c = conn.cursor()
    c.execute(sql, args)

    row = c.fetchone()
    while row:
        yield row
        row = c.fetchone()

    c.close()

def stream_movie_info(conn, info_type_id):

    stream = stream_tuples(conn, """
            SELECT distinct movie_id, info
            from movie_info
            where info_type_id = %s
            order by movie_id
        """, [info_type_id])

    return stream

def fast_jaccard(stream):
    """
    Fast computation of Jaccard of a stream
    - first column is the feature set elements
    - second column is the items
    - must be sorted by the first column
    """


    """
    Compute the Jaccard similarities (by approximation)
    """

    # Intersection of item pairs
    intersect = defaultdict(int)

    # Set of feature sets of items
    counts = defaultdict(int)

    for movie_id, g in groupby(stream, key=lambda x: x[0]):
        items = list(x[1] for x in g)
        for g1 in items:
            if g1:
                counts[g1] += 1
        for g1 in items:
            if not g1:
                continue

            for g2 in items:
                if not g2:
                    continue

                if g1 < g2:
                    intersect[(g1, g2)] += 1

    sim = defaultdict(int)

    for pair, k in intersect.items():
        sim[pair] = float(k)/max(counts[pair[0]], counts[pair[1]])

    return sim, counts

