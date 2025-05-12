-- AlterTable
CREATE SEQUENCE comments_comment_id_seq;
ALTER TABLE "Comments" ALTER COLUMN "Comment_ID" SET DEFAULT nextval('comments_comment_id_seq');
ALTER SEQUENCE comments_comment_id_seq OWNED BY "Comments"."Comment_ID";
