set -ex

# 현재 디렉터리 출력
pwd
# 상위 디렉터리로 변경
cd $(dirname $0)
pwd
cd ../..
pwd
# 현재 디렉터리 내 파일 목록 출력
ls

DOCKER_APP_NAME="gatee-api"
EXIST_BLUE=$(docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yaml ps | grep Up || true)

# 컨테이너 업
if [ -z "$EXIST_BLUE" ]; then
  echo "blue up"
  docker-compose -p ${DOCKER_APP_NAME}-blue -f docker-compose.blue.yaml up -d
  BEFORE_COMPOSE_COLOR="green"
  AFTER_COMPOSE_COLOR="blue"
else
  echo "green up"
  docker-compose -p ${DOCKER_APP_NAME}-green -f docker-compose.green.yaml up -d
  BEFORE_COMPOSE_COLOR="blue"
  AFTER_COMPOSE_COLOR="green"
fi

sleep 100
CONTAINER_COUNT=$(docker-compose -p ${DOCKER_APP_NAME}-${AFTER_COMPOSE_COLOR} -f docker-compose.${AFTER_COMPOSE_COLOR}.yaml ps | grep "^gatee-api-${AFTER_COMPOSE_COLOR}" | wc -l)
# 컨테이너가 제대로 작동하는지 확인하기 위해 반환값 체크
HEALTHY_COUNT=$(docker-compose -p ${DOCKER_APP_NAME}-${AFTER_COMPOSE_COLOR} -f docker-compose.${AFTER_COMPOSE_COLOR}.yaml ps -q | xargs -I {} docker inspect --format '{{.Name}} {{if .State.Health}}{{.State.Health.Status}}{{end}}' {} | awk -v app_name="/gatee-api-${AFTER_COMPOSE_COLOR}" '$0 ~ app_name && $NF == "healthy" {count++} END {print count+0}')

if [ "$HEALTHY_COUNT" -eq 2 ]; then
  echo "All containers are healthy. Proceeding with traffic switch."

  # 1. Nginx 설정을 새 버전으로 교체
  docker exec proxy-server cp /etc/nginx/nginx.${AFTER_COMPOSE_COLOR}.conf /etc/nginx/nginx.conf
  docker exec proxy-server nginx -s reload
  echo "Nginx now routing to ${AFTER_COMPOSE_COLOR}"

  # 2. 이전 버전 종료
  docker-compose -p ${DOCKER_APP_NAME}-${BEFORE_COMPOSE_COLOR} -f docker-compose.${BEFORE_COMPOSE_COLOR}.yaml down
  echo "${BEFORE_COMPOSE_COLOR} environment down"

else
  echo "❌ Not all containers are healthy yet. $HEALTHY_COUNT/$CONTAINER_COUNT"

  # 1. 새 버전 종료
  docker-compose -p ${DOCKER_APP_NAME}-${AFTER_COMPOSE_COLOR} -f docker-compose.${AFTER_COMPOSE_COLOR}.yaml down
  echo "🔙 ${AFTER_COMPOSE_COLOR} deployment failed. Rolled back."

  # Nginx 설정은 그대로 두되, 이전 버전이 계속 살아있으므로 정상 서비스 유지
fi
