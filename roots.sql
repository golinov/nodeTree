-- Adminer 4.7.6 MySQL dump

SET NAMES utf8;
SET time_zone = '+00:00';
SET foreign_key_checks = 0;
SET sql_mode = 'NO_AUTO_VALUE_ON_ZERO';

SET NAMES utf8mb4;

DROP TABLE IF EXISTS `tree`;
CREATE TABLE `tree` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `pid` int unsigned DEFAULT NULL,
  `name` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `parent_id` (`pid`),
  CONSTRAINT `tree_ibfk_1` FOREIGN KEY (`pid`) REFERENCES `tree` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


DELIMITER ;;

CREATE TRIGGER `tree__ai` AFTER INSERT ON `tree` FOR EACH ROW
BEGIN
    DECLARE new_path VARCHAR(255);

    SET new_path = CONCAT(
        IFNULL(
            (
                SELECT tp.path
                    FROM tree_path tp
                    WHERE tp.id = NEW.pid
            ),
            ''
        ),
        NEW.id,
        '-'
    );
    INSERT INTO tree_path (id, path)
        VALUES (NEW.id, new_path);
END;;

DELIMITER ;

DROP TABLE IF EXISTS `tree_path`;
CREATE TABLE `tree_path` (
  `id` int unsigned NOT NULL,
  `path` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  UNIQUE KEY `path` (`path`),
  CONSTRAINT `tree_path_ibfk_1` FOREIGN KEY (`id`) REFERENCES `tree` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- 2020-11-08 21:55:51
