all: build

build:
	@docker-compose	up	--build
down:
	@docker-compose	down

dbclean: down
	@docker volume prune -f

clean:	dbclean
	@rm -rf back/dist back/node_modules frontend/node_modules

fclean: down clean
	@docker rm -f	back frontend
	@docker system prune -af

re: down fclean build

.PHONY: all build down clean fclean re
