# Metflix
2021 모하개 넷플릭스 패러디 프로젝트

[노션링크](https://www.notion.so/Metflix-3737a52f6d1041cfaf7f1d5e215cc17a)

---
## ```.env``` 설정
```
# 로깅 레벨 
LOGGING_LEVEL=[info,debug,error]

# Mysql 환경변수 
MYSQL_HOST='your mysql host'
MYSQL_USER='your mysql username'
MYSQL_PASSWORD='your mysql password'
MYSQL_DATABASE='your mysql database'
```

---
## DataBase DDL
``` sql
# 사용자 테이블 생성 
CREATE TABLE file(  
    user_no int NOT NULL primary key AUTO_INCREMENT comment '사용자 번호',
    user_id varchar(100) NOT NULL UNIQUE,
    user_password varchar(255) NOT NULL,
    user_nickname varchar(255) NOT NULL,
    user_profile_file_no int NULL,
    user_type varchar(255)  NOT NULL
) default charset utf8 comment '사용자 테이블';

# 파일 테이블 생성 
CREATE TABLE file(  
    file_no int NOT NULL primary key AUTO_INCREMENT comment '파일번호',
    file_ext char(3) NOT NULL,
    file_url varchar(255) NOT NULL,
    file_type varchar(255) NOT NULL,
    file_status char(3) NOT NULL,
    file_reg_date DATETIME  NOT NULL DEFAULT now()
) default charset utf8 comment '파일테이블';
```