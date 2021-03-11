CREATE TABLE `messages` (
  `id` varchar(200) NOT NULL,
  `message` varchar(200) DEFAULT '',
  `sender_id` varchar(16) NOT NULL DEFAULT '',
  `receiver_id` varchar(16) NOT NULL DEFAULT '',
  `chat_id` varchar(200) NOT NULL,
  `created_date` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

CREATE TABLE `chats` (
  `chat_id` varchar(200) NOT NULL,
  `sender_id` varchar(16) NOT NULL DEFAULT '',
  `receiver_id` varchar(16) NOT NULL DEFAULT '',
  PRIMARY KEY (`chat_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

ALTER TABLE `users` 
    ADD COLUMN `socket_id` varchar(100) NOT NULL;