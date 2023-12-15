#run the following commands to start a docker container for pg

```bash
docker build -t my-postgres-image .
docker run -p 5432:5432 my-postgres-image
```
