-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Jan 20. 10:04
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `test2`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `comments`
--

DROP TABLE IF EXISTS `comments`;
CREATE TABLE `comments` (
  `id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `content` text NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `comments`
--

INSERT INTO `comments` (`id`, `news_id`, `content`, `user_id`, `created_at`) VALUES
(1, 31, 'komment #1', 1, '2026-01-08 10:51:16'),
(2, 34, 'komment #2', 1, '2026-01-08 11:07:46'),
(3, 31, 'komment #3', 1, '2026-01-12 07:55:57'),
(4, 31, 'komment #3', 1, '2026-01-12 07:55:57'),
(5, 30, 'Teszt komment', 1, '2026-01-20 08:51:35');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `events`
--

DROP TABLE IF EXISTS `events`;
CREATE TABLE `events` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `date` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `events`
--

INSERT INTO `events` (`id`, `title`, `description`, `date`) VALUES
(13, 'nem', NULL, '2026-01-14'),
(14, 'viktor', 'viktor rituális megölése\n', '2026-01-21'),
(15, 'qnki pukli', 'qnki', '2026-01-13');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `news`
--

DROP TABLE IF EXISTS `news`;
CREATE TABLE `news` (
  `id` int(11) NOT NULL,
  `title` varchar(255) NOT NULL,
  `content` longtext NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `cover_img` varchar(255) DEFAULT NULL,
  `user_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `created_at`, `cover_img`, `user_id`) VALUES
(24, 'Hír #1', '<p>Teszt szöveg</p>', '2025-12-15 21:32:37', '/covers/fontos.png', 1),
(25, 'Hír #2', '<p>Teszt szöveg</p>', '2025-12-15 21:32:42', '/covers/fontos.png', 1),
(26, 'Hír #3', '<p>Teszt szöveg</p>', '2025-12-15 22:46:34', '/covers/szavazas.png', 1),
(27, 'Hír #4', '<p>Teszt szöveg</p>', '2025-12-17 00:16:26', '/covers/bejelentes.png', 1),
(28, 'Hír #5', '<p>Teszt szöveg</p>', '2025-12-18 15:43:55', '/covers/bejelentes.png', 1),
(29, 'Hír #6', '<p>Teszt szöveg</p>', '2025-12-18 15:51:33', '/covers/bejelentes.png', 13),
(30, 'Hír #7', '<p>Teszt szöveg</p>', '2025-12-20 15:47:21', '/covers/fontos.png', 1),
(31, 'Hír #8', '<p>Teszt szöveg</p>', '2025-12-20 16:11:48', '/covers/felhivas.png', 1),
(32, 'Hír #9', '<p>Teszt szöveg</p>', '2025-12-20 20:59:54', '/covers/felhivas.png', 14),
(34, 'Hír #10', '<p>Teszt szöveg</p>', '2026-01-08 11:07:31', '/covers/bejelentes.png', 1);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `news_reactions`
--

DROP TABLE IF EXISTS `news_reactions`;
CREATE TABLE `news_reactions` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `news_id` int(11) NOT NULL,
  `reaction_type_id` int(11) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `news_reactions`
--

INSERT INTO `news_reactions` (`id`, `user_id`, `news_id`, `reaction_type_id`, `created_at`) VALUES
(2, 1, 34, 1, '2026-01-20 08:40:21');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `reaction_types`
--

DROP TABLE IF EXISTS `reaction_types`;
CREATE TABLE `reaction_types` (
  `id` int(11) NOT NULL,
  `key` varchar(50) NOT NULL,
  `label` varchar(50) NOT NULL,
  `icon` varchar(10) NOT NULL,
  `sort_order` int(3) DEFAULT 0
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- A tábla adatainak kiíratása `reaction_types`
--

INSERT INTO `reaction_types` (`id`, `key`, `label`, `icon`, `sort_order`) VALUES
(1, 'like', 'Tetszik', '👍', 1),
(2, 'dislike', 'NTetszik', '👎', 2),
(3, 'love', 'Imádom', '❤️', 3),
(4, 'wow', 'Meglepő', '😮', 4),
(5, 'sad', 'Szomorú', '😢', 5);

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `test_table`
--

DROP TABLE IF EXISTS `test_table`;
CREATE TABLE `test_table` (
  `test_table_id` int(11) NOT NULL,
  `test_table_text` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- A tábla adatainak kiíratása `test_table`
--

INSERT INTO `test_table` (`test_table_id`, `test_table_text`) VALUES
(1, 'test'),
(2, 'csumi');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `eduId` char(15) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`email`, `password`, `username`, `eduId`, `created_at`, `id`) VALUES
('nem', '$2b$10$7MPuuXFyv.Z27W5qyhfFJe6I54hus9CNG.TCr1lDX5mkM0zxmNbfW', 'admin', '000000000000', '2025-12-02 17:32:59', 1),
('asd@gmail.com', '$2b$10$BIEGU4nhTWyyVBaJOlXt8Of2s85k/yOCuh.X5IydYFdEdBqkZgXfW', 'asd1', '11111111111', '2025-11-29 15:47:49', 9),
('asd1@gmail.com', '$2b$10$rlW95n29CGUm56Khbu7zMu/cgBofgMhu9fm.7.5Swr1W3FwOMSbTi', 'asd2', '11111111112', '2025-11-29 15:48:10', 10),
('kbalintsuli@gmail.com', '$2b$10$AxyOKzfYfvaCNqehcDm/BOuIAKzGQtip6eOask02RTdUAEp2ns06G', 'Yamorus', '72746563199', '2025-11-29 18:36:09', 11),
('asdasd', '$2b$10$DVaBa6kzDiw9y/nKtXxcceOyjejA0hc4ZkEW7Epjl4CqQse4TbURu', 'Keint', '012012312313123', '2025-12-02 17:35:55', 13),
('asdijjj@gmail.com', '$2b$10$e3n8DVyqFKVC9QnNH39jEeRf709Xa7Mdgy0OsOMTLGxKiLi.7IAX6', 'Bal', '72727272727', '2025-12-20 18:30:51', 14),
('viktormail@gmail.com', '$2b$10$SYAtylbggZV8PViVC5Yeo.rl5njgAc2YPb7hZ5eI1kbKFWVpzmvc.', 'Viktor', '1111111111', '2026-01-15 12:13:58', 15);

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `comments`
--
ALTER TABLE `comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_user_comments` (`user_id`),
  ADD KEY `fk_comments_news` (`news_id`);

--
-- A tábla indexei `events`
--
ALTER TABLE `events`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

--
-- A tábla indexei `news_reactions`
--
ALTER TABLE `news_reactions`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `unique_user_news` (`user_id`,`news_id`),
  ADD KEY `fk_news_reactions_news` (`news_id`),
  ADD KEY `fk_news_reactions_type` (`reaction_type_id`);

--
-- A tábla indexei `reaction_types`
--
ALTER TABLE `reaction_types`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `key` (`key`);

--
-- A tábla indexei `test_table`
--
ALTER TABLE `test_table`
  ADD PRIMARY KEY (`test_table_id`);

--
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `eduId_UNIQUE` (`eduId`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT a táblához `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=35;

--
-- AUTO_INCREMENT a táblához `news_reactions`
--
ALTER TABLE `news_reactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `reaction_types`
--
ALTER TABLE `reaction_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `test_table`
--
ALTER TABLE `test_table`
  MODIFY `test_table_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `comments`
--
ALTER TABLE `comments`
  ADD CONSTRAINT `fk_comments_news` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_user_comments` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Megkötések a táblához `news`
--
ALTER TABLE `news`
  ADD CONSTRAINT `fk_news_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON UPDATE CASCADE;

--
-- Megkötések a táblához `news_reactions`
--
ALTER TABLE `news_reactions`
  ADD CONSTRAINT `fk_news_reactions_news` FOREIGN KEY (`news_id`) REFERENCES `news` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `fk_news_reactions_type` FOREIGN KEY (`reaction_type_id`) REFERENCES `reaction_types` (`id`),
  ADD CONSTRAINT `fk_news_reactions_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
