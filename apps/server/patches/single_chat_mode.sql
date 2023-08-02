ALTER TABLE `rookie-gpt`.`chat_conversation_configs` 
ADD COLUMN `single_chat_mode` TINYINT NULL DEFAULT 0 AFTER `presence_penalty`;