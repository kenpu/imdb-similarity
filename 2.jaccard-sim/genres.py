from common import *
from time import time
import sys

info = sys.argv[1] if sys.argv[1:] else "country"

conn = connect('imdb')
start = time()
if info == 'country':
    stream = stream_countries(conn)
else:
    stream = stream_genres(conn)
sim = fast_jaccard(stream)
duration = time() - start
conn.close()

print "Total = %.2f seconds" % duration

K = 100
print "Here are the top %d similar pairs" % K
for x in sorted(sim.items(), key=lambda x:x[-1], reverse=1)[:K]:
    a, b = x[0]
    sim  = x[1]
    print "(%.4f)    %15s   ---   %15s" % (sim, a, b)

