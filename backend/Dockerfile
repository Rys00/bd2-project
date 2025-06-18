FROM debian:latest
ENV PATH="/root/.local/bin:${PATH}"
RUN apt update &&  apt upgrade && apt install curl python3 postgresql-client -y
WORKDIR /app
COPY ./backend/ .
WORKDIR /app/bufet
RUN curl -LsSf https://astral.sh/uv/install.sh | sh && /root/.local/bin/uv sync 
ENV PATH="/app/bufet/.venv/bin:$PATH"
COPY baza/skrypty_sql/ /sql
CMD bash -c ./backend_up.sh