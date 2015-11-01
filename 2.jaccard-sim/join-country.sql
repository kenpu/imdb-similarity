select 
    T.title, 
    T.production_year, 
    C.name, 
    country_code,
    kind
from title T join movie_companies MC on T.id = MC.movie_id
     join company_name C on MC.company_id = C.id
     join company_type CT on MC.company_type_id = CT.id
where CT.kind = 'production companies'
limit 10
