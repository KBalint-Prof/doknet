-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Gép: 127.0.0.1
-- Létrehozás ideje: 2026. Feb 09. 12:14
-- Kiszolgáló verziója: 10.4.32-MariaDB
-- PHP verzió: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Adatbázis: `doknetdb`
--

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `chat_messages`
--

DROP TABLE IF EXISTS `chat_messages`;
CREATE TABLE `chat_messages` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `username` varchar(255) NOT NULL,
  `message` text NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

--
-- A tábla adatainak kiíratása `chat_messages`
--

INSERT INTO `chat_messages` (`id`, `user_id`, `username`, `message`, `created_at`) VALUES
(1, 16, 'admin1', 'haha', '2026-02-09 10:22:26'),
(2, 16, 'admin1', 'kk', '2026-02-09 10:22:35'),
(3, 16, 'admin1', 'sahsdfsd', '2026-02-09 11:10:23'),
(4, 16, 'admin1', 'fhbadfíf', '2026-02-09 11:10:24'),
(5, 16, 'admin1', 'fdsbfhs', '2026-02-09 11:10:25');

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
(5, 30, 'Teszt komment', 1, '2026-01-20 08:51:35'),
(6, 37, 'fasza', 1, '2026-01-24 14:42:37');

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
(15, 'qnki pukli', 'qnki', '2026-01-13'),
(16, 'jjj', 'hjj', '2026-02-18');

-- --------------------------------------------------------

--
-- Tábla szerkezet ehhez a táblához `gallery`
--

DROP TABLE IF EXISTS `gallery`;
CREATE TABLE `gallery` (
  `id` int(11) NOT NULL,
  `image_path` varchar(255) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_hungarian_ci;

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
  `user_id` int(11) NOT NULL,
  `is_deleted` tinyint(1) NOT NULL DEFAULT 0,
  `modified_at` datetime DEFAULT NULL,
  `modified_by` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `news`
--

INSERT INTO `news` (`id`, `title`, `content`, `created_at`, `cover_img`, `user_id`, `is_deleted`, `modified_at`, `modified_by`) VALUES
(24, 'Hír #1', '<p>Teszt szöveg</p>', '2025-12-15 21:32:37', '/covers/fontos.png', 1, 0, NULL, NULL),
(25, 'Hír #2', '<p>Teszt szöveg</p>', '2025-12-15 21:32:42', '/covers/fontos.png', 1, 0, NULL, NULL),
(26, 'Hír #3', '<p>Teszt szöveg</p>', '2025-12-15 22:46:34', '/covers/szavazas.png', 1, 0, NULL, NULL),
(27, 'Hír #4', '<p>Teszt szöveg</p>', '2025-12-17 00:16:26', '/covers/bejelentes.png', 1, 0, NULL, NULL),
(28, 'Hír #5', '<p>Teszt szöveg</p>', '2025-12-18 15:43:55', '/covers/bejelentes.png', 1, 0, NULL, NULL),
(29, 'Hír #6', '<p>Teszt szöveg</p>', '2025-12-18 15:51:33', '/covers/bejelentes.png', 13, 0, NULL, NULL),
(30, 'Hír #7', '<p>Teszt szöveg</p>', '2025-12-20 15:47:21', '/covers/fontos.png', 1, 0, NULL, NULL),
(31, 'Hír #8', '<p>Teszt szöveg</p>', '2025-12-20 16:11:48', '/covers/felhivas.png', 1, 0, NULL, NULL),
(32, 'Hír #9', '<p>Teszt szöveg</p>', '2025-12-20 20:59:54', '/covers/felhivas.png', 14, 0, NULL, NULL),
(34, 'Hír #10', '<p>Teszt szöveg</p>', '2026-01-08 11:07:31', '/covers/bejelentes.png', 1, 0, NULL, NULL),
(35, 'Hír #10.5', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet accumsan urna, ac tincidunt leo. Duis eget neque pharetra, maximus magna sit amet, cursus lorem. Etiam tempor augue non nibh vehicula dapibus. In vestibulum enim vel elit venenatis, vel aliquam metus molestie. Donec non accumsan mauris, condimentum egestas massa. Suspendisse potenti. Nullam elementum finibus lacus, vitae venenatis tellus pharetra vitae. Aenean eget mollis tellus. Suspendisse potenti. Mauris tristique turpis auctor metus consectetur convallis. Duis dolor ligula, volutpat sed risus in, ullamcorper aliquam metus. Nulla malesuada ipsum iaculis mi porttitor, a dignissim nulla condimentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed ultricies pharetra diam, sit amet egestas tortor consectetur quis.</p>\n<p>Vestibulum congue, enim vel sollicitudin tincidunt, ex ex aliquam lorem, eget bibendum enim dui vel ipsum. Aliquam tempus quam eros, eu pretium justo fringilla ac. Nullam tempus lectus nec massa ullamcorper luctus. Duis accumsan aliquam tempus. Duis non magna quis diam posuere accumsan. Curabitur consectetur molestie risus vel bibendum. Vestibulum ultrices ultrices odio id blandit. Pellentesque a tellus ac augue consequat lobortis.</p>\n<p>Vestibulum malesuada, mi in pellentesque auctor, elit elit tristique lectus, vitae scelerisque odio tellus volutpat odio. Nulla euismod tempor ultricies. Morbi ac mi nibh. Aenean ultrices sodales felis ullamcorper pellentesque. Aenean vel eros sed mi sodales laoreet. Aenean sed nisl lacinia, porttitor sem tristique, euismod risus. Etiam viverra semper nibh. Nunc dignissim arcu at tellus sollicitudin, eu lacinia nulla aliquam. Morbi suscipit, diam sit amet facilisis dictum, metus nisi porta erat, in pulvinar lorem nibh nec diam.</p>\n<p> </p>\n<p>szerkesztés teszt</p>', '2026-01-24 13:49:57', '/covers/felhivas.png', 1, 0, '2026-01-31 16:05:07', 13),
(36, 'Hír  #11', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse sit amet accumsan urna, ac tincidunt leo. Duis eget neque pharetra, maximus magna sit amet, cursus lorem. Etiam tempor augue non nibh vehicula dapibus. In vestibulum enim vel elit venenatis, vel aliquam metus molestie. Donec non accumsan mauris, condimentum egestas massa. Suspendisse potenti. Nullam elementum finibus lacus, vitae venenatis tellus pharetra vitae. Aenean eget mollis tellus. Suspendisse potenti. Mauris tristique turpis auctor metus consectetur convallis. Duis dolor ligula, volutpat sed risus in, ullamcorper aliquam metus. Nulla malesuada ipsum iaculis mi porttitor, a dignissim nulla condimentum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Sed ultricies pharetra diam, sit amet egestas tortor consectetur quis.</p>\n<p>Vestibulum congue, enim vel sollicitudin tincidunt, ex ex aliquam lorem, eget bibendum enim dui vel ipsum. Aliquam tempus quam eros, eu pretium justo fringilla ac. Nullam tempus lectus nec massa ullamcorper luctus. Duis accumsan aliquam tempus. Duis non magna quis diam posuere accumsan. Curabitur consectetur molestie risus vel bibendum. Vestibulum ultrices ultrices odio id blandit. Pellentesque a tellus ac augue consequat lobortis.</p>\n<p>Vestibulum malesuada, mi in pellentesque auctor, elit elit tristique lectus, vitae scelerisque odio tellus volutpat odio. Nulla euismod tempor ultricies. Morbi ac mi nibh. Aenean ultrices sodales felis ullamcorper pellentesque. Aenean vel eros sed mi sodales laoreet. Aenean sed nisl lacinia, porttitor sem tristique, euismod risus. Etiam viverra semper nibh. Nunc dignissim arcu at tellus sollicitudin, eu lacinia nulla aliquam. Morbi suscipit, diam sit amet facilisis dictum, metus nisi porta erat, in pulvinar lorem nibh nec diam.</p>', '2026-01-24 14:31:04', '/covers/felhivas.png', 1, 0, NULL, NULL),
(37, 'Hír #12', '<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse quis lacinia nisi, at elementum enim. Fusce justo neque, vestibulum vitae iaculis id, ullamcorper a nisl. Donec sed nisi dictum, egestas velit a, vulputate enim. Donec ac lorem a mauris sodales dictum quis sit amet purus. Mauris sit amet elit vitae libero tempus semper efficitur eu odio. Sed quis nisi bibendum leo placerat bibendum. Donec aliquam blandit nunc, a euismod justo. Nam elementum fermentum egestas. Sed sagittis, eros ac maximus egestas, nibh quam egestas leo, at maximus nunc tortor et mauris. Aliquam quam risus, molestie at mi ut, gravida congue urna. Aliquam sed mi suscipit, iaculis mauris ut, ornare ante. Phasellus bibendum nisl felis, sed laoreet justo congue ac. Nam quis odio in tortor feugiat consectetur. Aliquam fermentum nisi a mi accumsan, at tincidunt neque pellentesque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae;</p>\n<p>Etiam ullamcorper tristique purus sodales convallis. Nulla non purus et erat luctus elementum ut sed elit. Quisque maximus varius dui, sed interdum purus commodo et. Pellentesque sed sodales dui, ultrices pharetra orci. Integer in lectus lacinia, cursus diam et, condimentum nibh. Mauris porta felis eu dictum laoreet. Quisque sagittis purus in sollicitudin dignissim. Donec ullamcorper rhoncus odio, ultrices venenatis turpis.</p>\n<p>Nunc lobortis urna turpis, quis cursus elit consectetur et. Quisque facilisis orci felis, fringilla egestas felis tempus sit amet. Cras tempor at nulla vitae cursus. Phasellus in bibendum purus, sit amet maximus tellus. Sed id mi consectetur, accumsan ante nec, mattis sapien. Donec dolor mauris, posuere vitae feugiat a, eleifend eu augue. Nam eu urna id velit gravida fermentum eu condimentum erat. Donec ante mi, condimentum sit amet nibh non, suscipit pellentesque orci. Donec tempus, metus ut mollis ultrices, dui dui elementum augue, a iaculis nunc magna et dui. Aliquam mauris mi, efficitur blandit lectus at, vestibulum imperdiet metus.</p>\n<p> </p>\n<p>szerkesztés teszt 3</p>\n<p>szerkesztés teszt4</p>', '2026-01-24 14:42:29', '/covers/felhivas.png', 1, 0, '2026-01-31 15:54:35', 13);

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
(2, 1, 34, 1, '2026-01-20 08:40:21'),
(3, 1, 37, 1, '2026-01-24 15:42:39'),
(4, 13, 35, 3, '2026-01-31 16:05:14');

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
-- Tábla szerkezet ehhez a táblához `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `username` varchar(50) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `id` int(11) NOT NULL,
  `role` enum('student','member','president','teacher','admin') NOT NULL DEFAULT 'student'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_hungarian_ci;

--
-- A tábla adatainak kiíratása `users`
--

INSERT INTO `users` (`email`, `password`, `username`, `created_at`, `id`, `role`) VALUES
('nem', '$2b$10$7MPuuXFyv.Z27W5qyhfFJe6I54hus9CNG.TCr1lDX5mkM0zxmNbfW', 'admin', '2025-12-02 17:32:59', 1, 'admin'),
('asd@gmail.com', '$2b$10$BIEGU4nhTWyyVBaJOlXt8Of2s85k/yOCuh.X5IydYFdEdBqkZgXfW', 'asd1', '2025-11-29 15:47:49', 9, 'member'),
('asd1@gmail.com', '$2b$10$rlW95n29CGUm56Khbu7zMu/cgBofgMhu9fm.7.5Swr1W3FwOMSbTi', 'asd2', '2025-11-29 15:48:10', 10, 'member'),
('kbalintsuli@gmail.com', '$2b$10$AxyOKzfYfvaCNqehcDm/BOuIAKzGQtip6eOask02RTdUAEp2ns06G', 'Yamorus', '2025-11-29 18:36:09', 11, 'member'),
('asdasd', '$2b$10$DVaBa6kzDiw9y/nKtXxcceOyjejA0hc4ZkEW7Epjl4CqQse4TbURu', 'Keint', '2025-12-02 17:35:55', 13, 'member'),
('asdijjj@gmail.com', '$2b$10$e3n8DVyqFKVC9QnNH39jEeRf709Xa7Mdgy0OsOMTLGxKiLi.7IAX6', 'Bal', '2025-12-20 18:30:51', 14, 'member'),
('viktormail@gmail.com', '$2b$10$SYAtylbggZV8PViVC5Yeo.rl5njgAc2YPb7hZ5eI1kbKFWVpzmvc.', 'Viktor', '2026-01-15 12:13:58', 15, 'member'),
('valami@gmail.com', '$2b$10$HUvZp5Ya2HUUUM5sM1NYA.E28V8lsjGBES66qLwzavOIhDervDNEu', 'admin1', '2026-02-03 08:23:48', 16, 'admin'),
('tanarvagyok@gmail.com', '$2b$10$HtgGGCP8/9O.G710t5Gaf.rSWzlJbgy4dPqjMpwxpBcNNmXasRy3W', 'Tanár', '2026-02-03 17:55:38', 17, 'teacher'),
('elnok@gmail.com', '$2b$10$CAUR4xqQ/.tbDMwm6skikOJJQHZhLTnFi.skfEdH80uJAf5iAy47K', 'Elnök', '2026-02-03 18:00:09', 18, 'president');

--
-- Indexek a kiírt táblákhoz
--

--
-- A tábla indexei `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`);

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
-- A tábla indexei `gallery`
--
ALTER TABLE `gallery`
  ADD PRIMARY KEY (`id`);

--
-- A tábla indexei `news`
--
ALTER TABLE `news`
  ADD PRIMARY KEY (`id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `fk_news_modified_by` (`modified_by`);

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
-- A tábla indexei `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`);

--
-- A kiírt táblák AUTO_INCREMENT értéke
--

--
-- AUTO_INCREMENT a táblához `chat_messages`
--
ALTER TABLE `chat_messages`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `comments`
--
ALTER TABLE `comments`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT a táblához `events`
--
ALTER TABLE `events`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT a táblához `gallery`
--
ALTER TABLE `gallery`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT a táblához `news`
--
ALTER TABLE `news`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT a táblához `news_reactions`
--
ALTER TABLE `news_reactions`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT a táblához `reaction_types`
--
ALTER TABLE `reaction_types`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT a táblához `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=19;

--
-- Megkötések a kiírt táblákhoz
--

--
-- Megkötések a táblához `chat_messages`
--
ALTER TABLE `chat_messages`
  ADD CONSTRAINT `chat_messages_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`);

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
  ADD CONSTRAINT `fk_news_modified_by` FOREIGN KEY (`modified_by`) REFERENCES `users` (`id`),
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
