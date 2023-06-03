--
-- PostgreSQL database dump
--

-- Dumped from database version 15.2
-- Dumped by pg_dump version 15.3 (Ubuntu 15.3-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS posts_fk0;
ALTER TABLE IF EXISTS ONLY public.post_tag DROP CONSTRAINT IF EXISTS post_tag_fk1;
ALTER TABLE IF EXISTS ONLY public.post_tag DROP CONSTRAINT IF EXISTS post_tag_fk0;
ALTER TABLE IF EXISTS ONLY public.likes DROP CONSTRAINT IF EXISTS likes_fk1;
ALTER TABLE IF EXISTS ONLY public.likes DROP CONSTRAINT IF EXISTS likes_fk0;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS "users_userName_key";
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_pkey;
ALTER TABLE IF EXISTS ONLY public.users DROP CONSTRAINT IF EXISTS users_email_key;
ALTER TABLE IF EXISTS ONLY public.tags DROP CONSTRAINT IF EXISTS unique_name;
ALTER TABLE IF EXISTS ONLY public.tags DROP CONSTRAINT IF EXISTS tags_pkey;
ALTER TABLE IF EXISTS ONLY public.posts DROP CONSTRAINT IF EXISTS posts_pkey;
ALTER TABLE IF EXISTS ONLY public.post_tag DROP CONSTRAINT IF EXISTS post_tag_pkey;
ALTER TABLE IF EXISTS ONLY public.likes DROP CONSTRAINT IF EXISTS likes_pkey;
ALTER TABLE IF EXISTS public.users ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.tags ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.posts ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.post_tag ALTER COLUMN id DROP DEFAULT;
ALTER TABLE IF EXISTS public.likes ALTER COLUMN id DROP DEFAULT;
DROP SEQUENCE IF EXISTS public.users_id_seq;
DROP TABLE IF EXISTS public.users;
DROP SEQUENCE IF EXISTS public.tags_id_seq;
DROP TABLE IF EXISTS public.tags;
DROP SEQUENCE IF EXISTS public.posts_id_seq;
DROP TABLE IF EXISTS public.posts;
DROP SEQUENCE IF EXISTS public.post_tag_id_seq;
DROP TABLE IF EXISTS public.post_tag;
DROP SEQUENCE IF EXISTS public.likes_id_seq;
DROP TABLE IF EXISTS public.likes;
DROP SCHEMA IF EXISTS public;
--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "postId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- Name: post_tag; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.post_tag (
    id integer NOT NULL,
    "postId" integer NOT NULL,
    "tagId" integer NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: post_tag_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.post_tag_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: post_tag_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.post_tag_id_seq OWNED BY public.post_tag.id;


--
-- Name: posts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    description text NOT NULL,
    link text NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.tags (
    id integer NOT NULL,
    name character varying NOT NULL
);


--
-- Name: tags_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.tags_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: tags_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.tags_id_seq OWNED BY public.tags.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id integer NOT NULL,
    "userName" character varying NOT NULL,
    email character varying NOT NULL,
    picture text NOT NULL,
    password character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);


--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- Name: post_tag id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_tag ALTER COLUMN id SET DEFAULT nextval('public.post_tag_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: tags id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags ALTER COLUMN id SET DEFAULT nextval('public.tags_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: likes; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.likes VALUES (18, 6, 89, '2023-06-02 22:51:15.244527');
INSERT INTO public.likes VALUES (24, 6, 90, '2023-06-02 23:01:17.202021');
INSERT INTO public.likes VALUES (92, 1, 91, '2023-06-03 01:46:42.008238');
INSERT INTO public.likes VALUES (35, 6, 87, '2023-06-03 00:22:23.79228');
INSERT INTO public.likes VALUES (40, 9, 84, '2023-06-03 00:48:04.794381');
INSERT INTO public.likes VALUES (102, 4, 91, '2023-06-03 02:28:51.081974');
INSERT INTO public.likes VALUES (104, 1, 90, '2023-06-03 02:40:06.967243');
INSERT INTO public.likes VALUES (48, 9, 88, '2023-06-03 01:06:17.964649');
INSERT INTO public.likes VALUES (106, 4, 89, '2023-06-03 02:54:03.578947');
INSERT INTO public.likes VALUES (54, 9, 87, '2023-06-03 01:10:55.907596');


--
-- Data for Name: post_tag; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.post_tag VALUES (1, 2, 1, '2023-05-30 23:18:55.441454');
INSERT INTO public.post_tag VALUES (2, 3, 1, '2023-05-30 23:31:29.835958');
INSERT INTO public.post_tag VALUES (3, 4, 1, '2023-05-30 23:35:11.432807');
INSERT INTO public.post_tag VALUES (4, 2, 2, '2023-05-31 03:46:13.344158');
INSERT INTO public.post_tag VALUES (5, 2, 4, '2023-05-31 03:46:19.43681');
INSERT INTO public.post_tag VALUES (6, 5, 4, '2023-05-31 03:52:06.624898');
INSERT INTO public.post_tag VALUES (7, 7, 6, '2023-05-31 11:26:30.296582');
INSERT INTO public.post_tag VALUES (8, 8, 3, '2023-05-31 11:51:54.592965');
INSERT INTO public.post_tag VALUES (9, 9, 3, '2023-05-31 11:53:46.553195');
INSERT INTO public.post_tag VALUES (10, 9, 7, '2023-05-31 11:53:47.142612');
INSERT INTO public.post_tag VALUES (11, 10, 3, '2023-05-31 11:55:14.762408');
INSERT INTO public.post_tag VALUES (12, 10, 7, '2023-05-31 11:55:15.154935');
INSERT INTO public.post_tag VALUES (13, 10, 8, '2023-05-31 11:55:15.745854');
INSERT INTO public.post_tag VALUES (14, 10, 9, '2023-05-31 11:55:16.339468');
INSERT INTO public.post_tag VALUES (15, 11, 10, '2023-05-31 12:12:33.950868');
INSERT INTO public.post_tag VALUES (16, 11, 11, '2023-05-31 12:12:34.574974');
INSERT INTO public.post_tag VALUES (17, 11, 12, '2023-05-31 12:12:35.163687');
INSERT INTO public.post_tag VALUES (18, 12, 10, '2023-05-31 12:15:10.244795');
INSERT INTO public.post_tag VALUES (19, 12, 11, '2023-05-31 12:15:10.63692');
INSERT INTO public.post_tag VALUES (20, 12, 12, '2023-05-31 12:15:11.030584');
INSERT INTO public.post_tag VALUES (21, 12, 13, '2023-05-31 12:15:11.610126');
INSERT INTO public.post_tag VALUES (22, 13, 14, '2023-05-31 12:24:00.806008');
INSERT INTO public.post_tag VALUES (23, 13, 15, '2023-05-31 12:24:01.399019');
INSERT INTO public.post_tag VALUES (24, 13, 16, '2023-05-31 12:24:01.994721');
INSERT INTO public.post_tag VALUES (25, 15, 17, '2023-05-31 12:50:57.828825');
INSERT INTO public.post_tag VALUES (26, 15, 18, '2023-05-31 12:50:58.428538');
INSERT INTO public.post_tag VALUES (27, 16, 11, '2023-05-31 13:00:40.031981');
INSERT INTO public.post_tag VALUES (28, 17, 11, '2023-05-31 13:01:42.895842');
INSERT INTO public.post_tag VALUES (29, 18, 19, '2023-05-31 13:17:08.332807');
INSERT INTO public.post_tag VALUES (30, 19, 20, '2023-05-31 13:36:40.833969');
INSERT INTO public.post_tag VALUES (31, 24, 21, '2023-05-31 20:23:03.439311');
INSERT INTO public.post_tag VALUES (32, 24, 22, '2023-05-31 20:23:03.439311');
INSERT INTO public.post_tag VALUES (33, 24, 23, '2023-05-31 20:23:03.439311');
INSERT INTO public.post_tag VALUES (34, 24, 24, '2023-05-31 20:23:03.439311');
INSERT INTO public.post_tag VALUES (35, 25, 8, '2023-05-31 20:24:53.778884');
INSERT INTO public.post_tag VALUES (36, 25, 25, '2023-05-31 20:24:53.778884');
INSERT INTO public.post_tag VALUES (37, 25, 26, '2023-05-31 20:24:53.778884');
INSERT INTO public.post_tag VALUES (38, 26, 3, '2023-06-01 11:58:45.517757');
INSERT INTO public.post_tag VALUES (39, 26, 27, '2023-06-01 11:58:45.517757');
INSERT INTO public.post_tag VALUES (40, 26, 28, '2023-06-01 11:58:45.517757');
INSERT INTO public.post_tag VALUES (41, 61, 30, '2023-06-01 15:33:09.978922');
INSERT INTO public.post_tag VALUES (45, 75, 1, '2023-06-01 16:07:07.93281');
INSERT INTO public.post_tag VALUES (46, 75, 30, '2023-06-01 16:07:07.93281');
INSERT INTO public.post_tag VALUES (47, 75, 31, '2023-06-01 16:07:07.93281');
INSERT INTO public.post_tag VALUES (48, 75, 32, '2023-06-01 16:07:07.93281');
INSERT INTO public.post_tag VALUES (49, 76, 33, '2023-06-01 17:00:03.180804');
INSERT INTO public.post_tag VALUES (69, 79, 1, '2023-06-01 20:45:03.124802');
INSERT INTO public.post_tag VALUES (70, 79, 30, '2023-06-01 20:45:03.124802');
INSERT INTO public.post_tag VALUES (71, 79, 31, '2023-06-01 20:45:03.124802');
INSERT INTO public.post_tag VALUES (72, 79, 32, '2023-06-01 20:45:03.124802');
INSERT INTO public.post_tag VALUES (73, 79, 34, '2023-06-01 20:45:03.124802');
INSERT INTO public.post_tag VALUES (80, 81, 36, '2023-06-01 21:55:29.442815');
INSERT INTO public.post_tag VALUES (97, 87, 41, '2023-06-02 00:42:24.260817');
INSERT INTO public.post_tag VALUES (98, 87, 42, '2023-06-02 00:42:24.260817');
INSERT INTO public.post_tag VALUES (99, 89, 43, '2023-06-02 19:58:05.895326');
INSERT INTO public.post_tag VALUES (100, 91, 1, '2023-06-02 23:47:27.720043');
INSERT INTO public.post_tag VALUES (101, 91, 44, '2023-06-02 23:47:27.720043');


--
-- Data for Name: posts; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.posts VALUES (2, 6, 'Teste', 'https://www.google.com.br', '2023-05-30 23:18:54.82141');
INSERT INTO public.posts VALUES (3, 6, 'asd', 'https://www.google.com.br', '2023-05-30 23:31:29.438128');
INSERT INTO public.posts VALUES (4, 6, 'asd', 'https://www.google.com.br', '2023-05-30 23:35:11.034738');
INSERT INTO public.posts VALUES (7, 6, '', 'https://www.google.com.br', '2023-05-31 11:26:29.698133');
INSERT INTO public.posts VALUES (8, 6, 'Awesome article about #javascript', 'https://www.google.com.br', '2023-05-31 11:51:54.196585');
INSERT INTO public.posts VALUES (9, 6, 'Awesome article about #javascript #paodequeijo', 'https://www.google.com.br', '2023-05-31 11:53:46.157603');
INSERT INTO public.posts VALUES (10, 6, 'Awesome article about #javascript #paodequeijo #pao #DeuCerto', 'https://www.google.com.br', '2023-05-31 11:55:14.349395');
INSERT INTO public.posts VALUES (11, 6, 'tudo de bom #vidaboa #praia #mar', 'https://www.google.com.br', '2023-05-31 12:12:33.353388');
INSERT INTO public.posts VALUES (12, 6, 'tudo de bom #vidaboa #praia #mar #carrorebaixado', 'https://www.google.com.br', '2023-05-31 12:15:09.853913');
INSERT INTO public.posts VALUES (13, 6, 'otimo dia #lindo #amor #paz', 'https://www.google.com.br', '2023-05-31 12:24:00.212309');
INSERT INTO public.posts VALUES (14, 6, 'ola mundo', 'https://www.google.com.br', '2023-05-31 12:50:07.407809');
INSERT INTO public.posts VALUES (15, 6, 'opaaa #opa #testezin', 'https://www.google.com.br', '2023-05-31 12:50:57.189626');
INSERT INTO public.posts VALUES (16, 6, 'Opa tudo bom #praia', 'https://www.google.com.br', '2023-05-31 13:00:39.626681');
INSERT INTO public.posts VALUES (17, 6, 'Opa tudo bom #praia', 'https://www.google.com.br', '2023-05-31 13:01:42.481702');
INSERT INTO public.posts VALUES (18, 6, 'teste #trabalho', 'https://www.google.com.br', '2023-05-31 13:17:07.698708');
INSERT INTO public.posts VALUES (19, 6, 'opa trem bão #paodesal', 'https://www.google.com.br', '2023-05-31 13:36:40.248989');
INSERT INTO public.posts VALUES (20, 6, 'Otimo dia #macarrão #arroz #moto #caminhogrande', 'https://www.google.com.br', '2023-05-31 20:18:18.936721');
INSERT INTO public.posts VALUES (21, 6, 'Otimo dia #macarrão #arroz #moto #caminhogrande', 'https://www.google.com.br', '2023-05-31 20:18:44.910253');
INSERT INTO public.posts VALUES (22, 6, 'Otimo dia #macarrão #arroz #moto #caminhogrande', 'https://www.google.com.br', '2023-05-31 20:19:55.720885');
INSERT INTO public.posts VALUES (23, 6, 'Otimo dia #macarrão #arroz #moto #caminhogrande', 'https://www.google.com.br', '2023-05-31 20:21:00.176016');
INSERT INTO public.posts VALUES (24, 6, 'Otimo dia #macarrão #arroz #moto #caminhogrande', 'https://www.google.com.br', '2023-05-31 20:23:02.813632');
INSERT INTO public.posts VALUES (25, 6, 'otimo #demo #pao #ovo', 'https://imgur.com/gallery/D4a3eiF', '2023-05-31 20:24:53.194151');
INSERT INTO public.posts VALUES (5, 4, 'blablablabla', 'https://youtube.com', '2023-05-31 03:49:00.917817');
INSERT INTO public.posts VALUES (6, 4, 'blablablabla', 'https://youtube.com', '2023-05-31 03:52:06.624898');
INSERT INTO public.posts VALUES (1, 4, '', 'https://google.com', '2023-05-30 15:40:51.232807');
INSERT INTO public.posts VALUES (26, 1, 'Compartilhando um link no #youtube para testar o #javascript #musica', 'https://www.youtube.com/watch?v=QVNBByGesXo', '2023-06-01 11:58:44.815297');
INSERT INTO public.posts VALUES (27, 8, 'teste teste #teste', 'https://www.globo.com/', '2023-06-01 13:47:12.962776');
INSERT INTO public.posts VALUES (28, 8, 'teste', 'https://www.globo.com/', '2023-06-01 14:01:03.597968');
INSERT INTO public.posts VALUES (29, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:01:19.676484');
INSERT INTO public.posts VALUES (31, 8, 'teste', 'https://g1.globo.com/', '2023-06-01 14:07:19.359458');
INSERT INTO public.posts VALUES (33, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:10:55.477428');
INSERT INTO public.posts VALUES (34, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:12:18.643386');
INSERT INTO public.posts VALUES (35, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:39:37.07114');
INSERT INTO public.posts VALUES (36, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:40:19.46818');
INSERT INTO public.posts VALUES (37, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:50:08.94237');
INSERT INTO public.posts VALUES (38, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:51:56.248465');
INSERT INTO public.posts VALUES (39, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:52:53.815899');
INSERT INTO public.posts VALUES (40, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:54:21.978149');
INSERT INTO public.posts VALUES (41, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:56:17.073242');
INSERT INTO public.posts VALUES (42, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:56:28.736238');
INSERT INTO public.posts VALUES (43, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 14:56:52.918826');
INSERT INTO public.posts VALUES (44, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:17:48.142501');
INSERT INTO public.posts VALUES (46, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:22:28.42886');
INSERT INTO public.posts VALUES (47, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:22:58.841022');
INSERT INTO public.posts VALUES (48, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:24:30.802428');
INSERT INTO public.posts VALUES (49, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:25:16.376832');
INSERT INTO public.posts VALUES (50, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:26:50.949015');
INSERT INTO public.posts VALUES (51, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:27:50.790812');
INSERT INTO public.posts VALUES (52, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:28:31.808819');
INSERT INTO public.posts VALUES (53, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:29:37.919775');
INSERT INTO public.posts VALUES (55, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:30:29.698506');
INSERT INTO public.posts VALUES (57, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:31:15.993431');
INSERT INTO public.posts VALUES (58, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:31:43.159994');
INSERT INTO public.posts VALUES (59, 8, 'teste #teste', 'https://www.globo.com/', '2023-06-01 15:32:40.547587');
INSERT INTO public.posts VALUES (60, 8, 'teste #arroba', 'https://www.globo.com/', '2023-06-01 15:32:54.298521');
INSERT INTO public.posts VALUES (61, 8, 'teste #arroba', 'https://www.globo.com/', '2023-06-01 15:33:09.359659');
INSERT INTO public.posts VALUES (62, 8, 'teste #arroba', 'https://www.globo.com/', '2023-06-01 15:33:23.182032');
INSERT INTO public.posts VALUES (63, 8, 'teste #arroba', 'https://www.globo.com/', '2023-06-01 15:52:36.304888');
INSERT INTO public.posts VALUES (64, 8, 'teste #arroba', 'https://www.globo.com/', '2023-06-01 15:52:56.766723');
INSERT INTO public.posts VALUES (65, 8, 'teste #arroba #teste #novo', 'https://www.globo.com/', '2023-06-01 15:53:26.57193');
INSERT INTO public.posts VALUES (66, 8, 'teste #arroba #teste #novo', 'https://www.globo.com/', '2023-06-01 15:55:43.856872');
INSERT INTO public.posts VALUES (67, 8, 'teste #arroba #teste #novo', 'https://www.globo.com/', '2023-06-01 15:56:08.933682');
INSERT INTO public.posts VALUES (68, 8, 'teste #arroba #teste #novo', 'https://www.globo.com/', '2023-06-01 15:56:34.400447');
INSERT INTO public.posts VALUES (69, 8, 'teste #arroba #teste #novo', 'https://www.globo.com/', '2023-06-01 15:57:30.027105');
INSERT INTO public.posts VALUES (70, 8, 'teste #arroba #teste #novo', 'https://www.globo.com/', '2023-06-01 15:57:58.753986');
INSERT INTO public.posts VALUES (72, 8, 'teste #arroba #teste #novo', 'https://www.globo.com/', '2023-06-01 15:59:34.357609');
INSERT INTO public.posts VALUES (73, 8, 'teste #arroba #teste #novo', 'https://www.globo.com/', '2023-06-01 16:00:16.327738');
INSERT INTO public.posts VALUES (75, 8, 'teste #arroba #teste #novo #newtagonlyfortest', 'https://www.globo.com/', '2023-06-01 16:07:07.277552');
INSERT INTO public.posts VALUES (76, 1, 'teste só #YoUtUbE', 'https://youtube.com', '2023-06-01 17:00:02.600881');
INSERT INTO public.posts VALUES (77, 8, 'testando delete', 'https://www.globo.com/', '2023-06-01 17:24:42.143815');
INSERT INTO public.posts VALUES (82, 10, '', 'https://youtube.com', '2023-06-01 22:55:40.269646');
INSERT INTO public.posts VALUES (79, 8, 'teste #arroba #teste #novo #newtagonlyfortest #onemorefortest', 'https://chat.openai.com', '2023-06-01 20:45:02.709704');
INSERT INTO public.posts VALUES (81, 4, 'bla bla bla bla #CriandoUmaTagNovaPQSim', 'https://www.instagram.com', '2023-06-01 21:55:28.748982');
INSERT INTO public.posts VALUES (83, 9, 'otimo ', 'https://www.google.com.br', '2023-06-01 22:55:47.482234');
INSERT INTO public.posts VALUES (84, 10, '#', 'https://youtube.com', '2023-06-01 22:59:28.830656');
INSERT INTO public.posts VALUES (78, 8, 'algumascoisas # ', 'https://www.globo.com/', '2023-06-01 18:17:06.349735');
INSERT INTO public.posts VALUES (87, 1, 'batata #batata #batatinha', 'https://www.pringles.com/pt/home.html', '2023-06-02 00:42:23.350423');
INSERT INTO public.posts VALUES (88, 8, 'testando um tweet um pouco maior apaenas para ver se quebra o front
', 'https://www.globo.com/', '2023-06-02 17:44:58.636277');
INSERT INTO public.posts VALUES (89, 8, 'teste edit #edit', 'https://www.globo.com/', '2023-06-02 18:29:00.520076');
INSERT INTO public.posts VALUES (90, 17, 'teste', 'https://www.globo.com/', '2023-06-02 21:30:36.031693');
INSERT INTO public.posts VALUES (91, 9, 'Otimo teste para ver se atualiza a tela #teste #dev', 'https://www.google.com.br', '2023-06-02 23:47:27.116824');


--
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.tags VALUES (2, 'react');
INSERT INTO public.tags VALUES (3, 'javascript');
INSERT INTO public.tags VALUES (4, 'mongodb');
INSERT INTO public.tags VALUES (5, 'postgresql');
INSERT INTO public.tags VALUES (1, 'teste');
INSERT INTO public.tags VALUES (6, 'Incrível bro #love');
INSERT INTO public.tags VALUES (7, 'paodequeijo');
INSERT INTO public.tags VALUES (8, 'pao');
INSERT INTO public.tags VALUES (9, 'DeuCerto');
INSERT INTO public.tags VALUES (10, 'vidaboa');
INSERT INTO public.tags VALUES (11, 'praia');
INSERT INTO public.tags VALUES (12, 'mar');
INSERT INTO public.tags VALUES (13, 'carrorebaixado');
INSERT INTO public.tags VALUES (14, 'lindo');
INSERT INTO public.tags VALUES (15, 'amor');
INSERT INTO public.tags VALUES (16, 'paz');
INSERT INTO public.tags VALUES (17, 'opa');
INSERT INTO public.tags VALUES (18, 'testezin');
INSERT INTO public.tags VALUES (19, 'trabalho');
INSERT INTO public.tags VALUES (20, 'paodesal');
INSERT INTO public.tags VALUES (21, 'macarrão');
INSERT INTO public.tags VALUES (22, 'arroz');
INSERT INTO public.tags VALUES (23, 'moto');
INSERT INTO public.tags VALUES (24, 'caminhogrande');
INSERT INTO public.tags VALUES (25, 'demo');
INSERT INTO public.tags VALUES (26, 'ovo');
INSERT INTO public.tags VALUES (27, 'youtube');
INSERT INTO public.tags VALUES (28, 'musica');
INSERT INTO public.tags VALUES (30, 'arroba');
INSERT INTO public.tags VALUES (31, 'novo');
INSERT INTO public.tags VALUES (32, 'newtagonlyfortest');
INSERT INTO public.tags VALUES (33, 'YoUtUbE');
INSERT INTO public.tags VALUES (34, 'onemorefortest');
INSERT INTO public.tags VALUES (35, 'newone');
INSERT INTO public.tags VALUES (36, 'CriandoUmaTagNovaPQSim');
INSERT INTO public.tags VALUES (37, '');
INSERT INTO public.tags VALUES (38, 'e');
INSERT INTO public.tags VALUES (39, 'estes');
INSERT INTO public.tags VALUES (40, 'alguma');
INSERT INTO public.tags VALUES (41, 'batata');
INSERT INTO public.tags VALUES (42, 'batatinha');
INSERT INTO public.tags VALUES (43, 'edit');
INSERT INTO public.tags VALUES (44, 'dev');


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

INSERT INTO public.users VALUES (1, 'user1', 'email@email.br', 'https://centaur-wp.s3.eu-central-1.amazonaws.com/designweek/prod/content/uploads/2021/09/22153530/Pringles-logo.jpg', '$2b$10$MCcy1zRG7ICEmm4FdWIkaOmgJPRv6EMQ3BZtF9EDyjYeJSDvQujv.', '2023-05-30 05:04:00.554336');
INSERT INTO public.users VALUES (4, 'raf', 'raf@raf.com', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSuKtrnPpHoB8fboN3hliVeYRNPGpS-9v0Nfg&usqp=CAU', '$2b$10$o9CnfUmBwvsJe2Okxz/fue/lE1f34Iq9U27/DQYNhU3d9BEAvgsP.', '2023-05-30 07:10:53.036812');
INSERT INTO public.users VALUES (6, 'edudev', 'edu@dev.com', 'https://img.freepik.com/fotos-premium/aviao-decolando-do-aeroporto_37416-74.jpg', '$2b$10$35W75yhZRJtIPauJHbtcZ.pSvHxojXbDeARv2bzKKMiZRYBL/l72W', '2023-05-30 20:23:59.036814');
INSERT INTO public.users VALUES (7, 'usuario test 1', 'usuariotest@email.com', 'https://youtube.com', '$2b$10$0us9qOu9qWOBdaP364GIde5gdWDaz5FJN8Pj8pRawWoHhESLs7Uzy', '2023-05-30 22:23:43.233557');
INSERT INTO public.users VALUES (8, 'zeeeee', 'ze@gmail.com', 'https://blog.emania.com.br/wp-content/uploads/2020/12/water-3167440_1920.jpg', '$2b$10$Qwr.iyVJ.tvKWHGiUNHHeu8gcIh5jKYsRWyyxRmZxZpcKlkMESjOC', '2023-06-01 13:45:54.058296');
INSERT INTO public.users VALUES (9, 'eduteste', 'edu@teste.com', 'https://st.depositphotos.com/2288675/2455/i/600/depositphotos_24553989-stock-photo-hotel.jpg', '$2b$10$uIJ0aAwjaQW7LW9V5frSJu6WgIGK8FHjgi0Gp5ldeKL6hIHVPOPg2', '2023-06-01 20:32:01.803958');
INSERT INTO public.users VALUES (10, 'aoba', 'emailbolado@email.com', 'https://youtube.com', '$2b$10$ymKMLOWw1Susxl5OSAMtyeenpzkQsTG/1h31.rDDwSnRAdLMF8HWO', '2023-06-01 20:51:09.171865');
INSERT INTO public.users VALUES (11, 'edudevjr', 'edu@devjr.com', 'https://img.freepik.com/fotos-premium/aviao-decolando-do-aeroporto_37416-74.jpg', '$2b$10$RmbNHl/YkYWZtWpt4xtQK.JrMDfxkwESwNnfavWsz/4nzqtAxxJBe', '2023-06-01 23:32:47.499211');
INSERT INTO public.users VALUES (12, 'eduteste2', 'edu@teste2.com', 'https://img.freepik.com/fotos-premium/aviao-decolando-do-aeroporto_37416-74.jpg', '$2b$10$EpytnYPNFMcVJlp7g6nho.KUb0hzRmnNWhE3.BLgAR1ofFnrQkEoy', '2023-06-01 23:52:32.291014');
INSERT INTO public.users VALUES (13, 'eduteste3', 'edu@teste3.com', 'https://st.depositphotos.com/2288675/2455/i/600/depositphotos_24553989-stock-photo-hotel.jpg', '$2b$10$g0XoJdUa8g3HthbMQS4bnO./4ir4svYv7K3.fMW9bNe.qTQmLWU9y', '2023-06-01 23:52:49.906434');
INSERT INTO public.users VALUES (14, 'edudev2', 'edu@teste4.com', 'https://img.freepik.com/fotos-premium/aviao-decolando-do-aeroporto_37416-74.jpg', '$2b$10$.LJVYTUE2I.0fZO0Bjg8SuLqhxgyGsgHIuytKA0xsnFMzLz6RB88G', '2023-06-01 23:53:04.961629');
INSERT INTO public.users VALUES (16, 'edudev5', 'edu@teste5.com', 'https://img.freepik.com/fotos-premium/aviao-decolando-do-aeroporto_37416-74.jpg', '$2b$10$vz.988JK2eOzS4Zf1RXZWuMZH9xhVeqcY0Snqxy2II8QfFzU6iH6.', '2023-06-01 23:53:30.461215');
INSERT INTO public.users VALUES (17, 'zeeeeeee', 'zee@gmail.com', 'https://blog.emania.com.br/wp-content/uploads/2020/12/water-3167440_1920.jpg', '$2b$10$e82nqQF780HcpGYDr3katuszsABFcllrvaf8gzYV7j0YKobpt1BpK', '2023-06-02 21:30:26.160687');


--
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.likes_id_seq', 106, true);


--
-- Name: post_tag_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.post_tag_id_seq', 101, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.posts_id_seq', 91, true);


--
-- Name: tags_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.tags_id_seq', 44, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: -
--

SELECT pg_catalog.setval('public.users_id_seq', 17, true);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: post_tag post_tag_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_tag
    ADD CONSTRAINT post_tag_pkey PRIMARY KEY (id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- Name: tags unique_name; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT unique_name UNIQUE (name);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_userName_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT "users_userName_key" UNIQUE ("userName");


--
-- Name: likes likes_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_fk0 FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- Name: likes likes_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_fk1 FOREIGN KEY ("postId") REFERENCES public.posts(id);


--
-- Name: post_tag post_tag_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_tag
    ADD CONSTRAINT post_tag_fk0 FOREIGN KEY ("postId") REFERENCES public.posts(id);


--
-- Name: post_tag post_tag_fk1; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.post_tag
    ADD CONSTRAINT post_tag_fk1 FOREIGN KEY ("tagId") REFERENCES public.tags(id);


--
-- Name: posts posts_fk0; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_fk0 FOREIGN KEY ("userId") REFERENCES public.users(id);


--
-- PostgreSQL database dump complete
--

