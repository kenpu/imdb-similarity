import psycopg2 as pg
from itertools import groupby
from collections import defaultdict

GENRES_INFO_TYPE_ID = 3
COUNTRY_INFO_TYPE_ID = 51

def connect(dbname):
    return pg.connect("dbname='%s'" % dbname)

def list_genres(conn):
    
    c = conn.cursor()
    c.execute("""
        select info, count(distinct movie_id)  
        from movie_info 
        where info_type_id  = %s
    """, [GENRES_INFO_TYPE_ID])

    result = c.fetchall()
    c.close()

    return result

def list_tables(conn):
    c = db.cursor()

    c.execute('''
        select table_name from information_schema.tables
        where table_schema = 'public'
        ''')
    result = [x[0] for x in c.fetchall()]

    c.close()

    return result

def stream_tuples(conn, sql, args):
    c = conn.cursor()
    c.execute(sql, args)

    row = c.fetchone()
    while row:
        yield row
        row = c.fetchone()

    c.close()

def stream_genres(conn):

    stream = stream_tuples(conn, """
            SELECT distinct movie_id, info
            from movie_info
            where info_type_id = %s
            order by movie_id
        """, [GENRES_INFO_TYPE_ID])

    return stream

def stream_countries(conn):
    sql = """
        select distinct MC.movie_id, country_code
        from movie_companies MC
            join company_name C on MC.company_id = C.id
            join company_type CT on MC.company_type_id = CT.id
        where CT.kind = 'production companies'
        order by MC.movie_id
    """

    return stream_tuples(conn, sql, [])

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
    intersect = defaultdict(int)
    counts = defaultdict(int)

    for movie_id, g in groupby(stream, key=lambda x: x[0]):
        genres = list(x[1] for x in g)
        for g1 in genres:
            if g1:
                counts[g1] += 1
        for g1 in genres:
            if not g1:
                continue

            for g2 in genres:
                if not g2:
                    continue

                if g1 < g2:
                    intersect[(g1, g2)] += 1

    sim = defaultdict(int)

    for pair, k in intersect.items():
        sim[pair] = float(k)/max(counts[pair[0]], counts[pair[1]])

    return sim

