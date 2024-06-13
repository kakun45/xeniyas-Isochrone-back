show session status;
show databases;

use freedb_isocrones;
show tables;

-- create tables with npm run migrate, then seed
 
drop table edges;
drop table nodes;

SELECT * from nodes;
SELECT * from edges;

-- change env vars on vercel
-- redeploy