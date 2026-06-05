-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jun 05, 2026 at 03:39 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `trancosmos_assesment`
--

-- --------------------------------------------------------

--
-- Table structure for table `cache`
--

CREATE TABLE `cache` (
  `key` varchar(255) NOT NULL,
  `value` mediumtext NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cache_locks`
--

CREATE TABLE `cache_locks` (
  `key` varchar(255) NOT NULL,
  `owner` varchar(255) NOT NULL,
  `expiration` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `failed_jobs`
--

CREATE TABLE `failed_jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `uuid` varchar(255) NOT NULL,
  `connection` text NOT NULL,
  `queue` text NOT NULL,
  `payload` longtext NOT NULL,
  `exception` longtext NOT NULL,
  `failed_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `jobs`
--

CREATE TABLE `jobs` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `queue` varchar(255) NOT NULL,
  `payload` longtext NOT NULL,
  `attempts` tinyint(3) UNSIGNED NOT NULL,
  `reserved_at` int(10) UNSIGNED DEFAULT NULL,
  `available_at` int(10) UNSIGNED NOT NULL,
  `created_at` int(10) UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `jobs`
--

INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES
(4, 'default', '{\"uuid\":\"93820117-8d2b-4141-8c0e-ae38470148d3\",\"displayName\":\"App\\\\Jobs\\\\SendTaskNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendTaskNotification\",\"command\":\"O:29:\\\"App\\\\Jobs\\\\SendTaskNotification\\\":1:{s:7:\\\"\\u0000*\\u0000task\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\Task\\\";s:2:\\\"id\\\";i:22;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}\",\"batchId\":null},\"createdAt\":1780377511,\"delay\":null}', 0, NULL, 1780377511, 1780377511),
(5, 'default', '{\"uuid\":\"a2ff9525-50a6-4969-872f-a4c0f2dfef39\",\"displayName\":\"App\\\\Jobs\\\\SendTaskNotification\",\"job\":\"Illuminate\\\\Queue\\\\CallQueuedHandler@call\",\"maxTries\":null,\"maxExceptions\":null,\"failOnTimeout\":false,\"backoff\":null,\"timeout\":null,\"retryUntil\":null,\"data\":{\"commandName\":\"App\\\\Jobs\\\\SendTaskNotification\",\"command\":\"O:29:\\\"App\\\\Jobs\\\\SendTaskNotification\\\":1:{s:7:\\\"\\u0000*\\u0000task\\\";O:45:\\\"Illuminate\\\\Contracts\\\\Database\\\\ModelIdentifier\\\":5:{s:5:\\\"class\\\";s:15:\\\"App\\\\Models\\\\Task\\\";s:2:\\\"id\\\";i:23;s:9:\\\"relations\\\";a:0:{}s:10:\\\"connection\\\";s:5:\\\"mysql\\\";s:15:\\\"collectionClass\\\";N;}}\",\"batchId\":null},\"createdAt\":1780551911,\"delay\":null}', 0, NULL, 1780551911, 1780551911);

-- --------------------------------------------------------

--
-- Table structure for table `job_batches`
--

CREATE TABLE `job_batches` (
  `id` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `total_jobs` int(11) NOT NULL,
  `pending_jobs` int(11) NOT NULL,
  `failed_jobs` int(11) NOT NULL,
  `failed_job_ids` longtext NOT NULL,
  `options` mediumtext DEFAULT NULL,
  `cancelled_at` int(11) DEFAULT NULL,
  `created_at` int(11) NOT NULL,
  `finished_at` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `migrations`
--

CREATE TABLE `migrations` (
  `id` int(10) UNSIGNED NOT NULL,
  `migration` varchar(255) NOT NULL,
  `batch` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `migrations`
--

INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES
(1, '0001_01_01_000000_create_users_table', 1),
(2, '0001_01_01_000001_create_cache_table', 1),
(3, '0001_01_01_000002_create_jobs_table', 1),
(4, '2026_05_27_031712_create_tasks_table', 1),
(5, '2026_05_27_031725_create_task_attachments_table', 1),
(6, '2026_05_27_031732_create_task_comments_table', 1),
(7, '2026_05_27_035642_create_personal_access_tokens_table', 2),
(8, '2026_05_30_144208_create_task_user_table', 3);

-- --------------------------------------------------------

--
-- Table structure for table `password_reset_tokens`
--

CREATE TABLE `password_reset_tokens` (
  `email` varchar(255) NOT NULL,
  `token` varchar(255) NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `personal_access_tokens`
--

CREATE TABLE `personal_access_tokens` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `tokenable_type` varchar(255) NOT NULL,
  `tokenable_id` bigint(20) UNSIGNED NOT NULL,
  `name` text NOT NULL,
  `token` varchar(64) NOT NULL,
  `abilities` text DEFAULT NULL,
  `last_used_at` timestamp NULL DEFAULT NULL,
  `expires_at` timestamp NULL DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `personal_access_tokens`
--

INSERT INTO `personal_access_tokens` (`id`, `tokenable_type`, `tokenable_id`, `name`, `token`, `abilities`, `last_used_at`, `expires_at`, `created_at`, `updated_at`) VALUES
(1, 'App\\Models\\User', 6, 'auth_token', 'a00fae37f8d13a520ff0c82d53a51759b35ddc2e9d8d81b123d3a411f29b83c9', '[\"*\"]', '2026-05-26 22:46:59', NULL, '2026-05-26 21:12:50', '2026-05-26 22:46:59'),
(2, 'App\\Models\\User', 6, 'auth_token', '3af731c7d77f2bed7e343c022209d1ba9f2f3449fa5679ae2e1e41b7f0fbee1f', '[\"*\"]', '2026-05-26 23:45:10', NULL, '2026-05-26 22:47:53', '2026-05-26 23:45:10'),
(5, 'App\\Models\\User', 6, 'auth_token', '4511802da424811f97bd5329fcf93c79d6a9573227ecdff5f6f5b40c85592350', '[\"*\"]', NULL, NULL, '2026-05-27 08:34:49', '2026-05-27 08:34:49'),
(7, 'App\\Models\\User', 6, 'auth_token', '6272c39e5db85ecb8a70ac03a67f66265df35809aa12f0f6c3aa36a2de070d10', '[\"*\"]', '2026-05-28 02:29:32', NULL, '2026-05-28 02:29:28', '2026-05-28 02:29:32'),
(14, 'App\\Models\\User', 6, 'auth_token', '21f2220a9a98ecbd863f59af58d260a8c34725d79a840c65f13483aeea87dab8', '[\"*\"]', '2026-06-01 21:39:21', NULL, '2026-06-01 21:19:10', '2026-06-01 21:39:21'),
(23, 'App\\Models\\User', 6, 'auth_token', '2f09560a447c877b2f2d14daaa1372199e32d5b500f4d39c53501ac105bb6c4d', '[\"*\"]', '2026-06-02 04:34:53', NULL, '2026-06-02 04:26:54', '2026-06-02 04:34:53'),
(25, 'App\\Models\\User', 6, 'auth_token', 'b500902f8e9b749222e1faaa2ef9ad0418d81331e427e853bdb999f5bd9eced8', '[\"*\"]', '2026-06-02 07:05:36', NULL, '2026-06-02 07:05:14', '2026-06-02 07:05:36'),
(26, 'App\\Models\\User', 8, 'auth_token', 'a62aea2ce665360fcb7374312a39adb593a20a0552dbce38091e7d50bd266a18', '[\"*\"]', '2026-06-02 07:12:01', NULL, '2026-06-02 07:05:40', '2026-06-02 07:12:01'),
(30, 'App\\Models\\User', 9, 'auth_token', 'd92c4c4b933206e91f99719b5eabd215e4f3736407d4194d4c8eb5e8bdc48e94', '[\"*\"]', '2026-06-03 22:47:50', NULL, '2026-06-03 22:46:51', '2026-06-03 22:47:50');

-- --------------------------------------------------------

--
-- Table structure for table `sessions`
--

CREATE TABLE `sessions` (
  `id` varchar(255) NOT NULL,
  `user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `ip_address` varchar(45) DEFAULT NULL,
  `user_agent` text DEFAULT NULL,
  `payload` longtext NOT NULL,
  `last_activity` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Table structure for table `tasks`
--

CREATE TABLE `tasks` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `title` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `status` varchar(255) NOT NULL,
  `priority` varchar(255) NOT NULL,
  `assigned_user_id` bigint(20) UNSIGNED DEFAULT NULL,
  `created_by` bigint(20) UNSIGNED NOT NULL,
  `due_date` date DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `tasks`
--

INSERT INTO `tasks` (`id`, `title`, `description`, `status`, `priority`, `assigned_user_id`, `created_by`, `due_date`, `created_at`, `updated_at`) VALUES
(23, 'Create and Develop REST API PHP', 'REST API with implement websocker', 'pending', 'medium', NULL, 6, '2026-06-06', '2026-06-03 22:45:08', '2026-06-03 22:45:08');

-- --------------------------------------------------------

--
-- Table structure for table `task_attachments`
--

CREATE TABLE `task_attachments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` varchar(255) DEFAULT NULL COMMENT 'get attachment per user',
  `file_name` varchar(255) NOT NULL,
  `file_path` varchar(255) NOT NULL,
  `file_size` int(11) NOT NULL,
  `mime_type` varchar(255) NOT NULL,
  `uploaded_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `task_attachments`
--

INSERT INTO `task_attachments` (`id`, `task_id`, `user_id`, `file_name`, `file_path`, `file_size`, `mime_type`, `uploaded_at`) VALUES
(4, 23, '9', 'TSP_CMES_57788.pdf', 'attachments/VGfELUjQOj6pfpeQ8OBZdo2LTnWFv8MVHJZlsGSS.pdf', 2068442, 'application/pdf', '2026-06-04 05:47:42');

-- --------------------------------------------------------

--
-- Table structure for table `task_comments`
--

CREATE TABLE `task_comments` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `comment` text NOT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `task_comments`
--

INSERT INTO `task_comments` (`id`, `task_id`, `user_id`, `comment`, `created_at`, `updated_at`) VALUES
(1, 15, 5, 'Occaecati commodi quia nam.', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(2, 15, 9, 'Nisi ipsa nulla voluptatem laudantium ut atque et.', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(3, 2, 10, 'Architecto saepe soluta dolores cumque.', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(4, 3, 3, 'Dignissimos saepe quis omnis et sequi quisquam nesciunt dolores.', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(5, 13, 6, 'Fugit ut cupiditate vitae quo.', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(6, 3, 8, 'Atque dolor aliquam est tempora.', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(7, 10, 6, 'Doloribus est dolores qui non reiciendis.', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(8, 10, 9, 'Consequatur amet nobis est iste.', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(9, 13, 4, 'Odio quo tenetur et fuga culpa deserunt incidunt dolores.', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(10, 5, 9, 'Iste ut dicta impedit quisquam autem.', '2026-05-26 20:43:39', '2026-05-26 20:43:39');

-- --------------------------------------------------------

--
-- Table structure for table `task_user`
--

CREATE TABLE `task_user` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `task_id` bigint(20) UNSIGNED NOT NULL,
  `user_id` bigint(20) UNSIGNED NOT NULL,
  `status` varchar(100) DEFAULT NULL,
  `assigned_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `finish_at` timestamp NULL DEFAULT NULL,
  `read_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `task_user`
--

INSERT INTO `task_user` (`id`, `task_id`, `user_id`, `status`, `assigned_at`, `finish_at`, `read_at`) VALUES
(6, 23, 7, NULL, '2026-06-04 05:45:09', NULL, NULL),
(7, 23, 8, NULL, '2026-06-04 05:45:09', NULL, NULL),
(8, 23, 9, 'completed', '2026-06-04 05:45:09', '2026-06-03 22:47:48', '2026-06-03 22:47:04'),
(9, 23, 10, NULL, '2026-06-04 05:45:09', NULL, NULL);

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` bigint(20) UNSIGNED NOT NULL,
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `email_verified_at` timestamp NULL DEFAULT NULL,
  `role` varchar(10) NOT NULL DEFAULT '3' COMMENT '1 for admin\r\n3 for user',
  `password` varchar(255) NOT NULL,
  `remember_token` varchar(100) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT NULL,
  `updated_at` timestamp NULL DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `role`, `password`, `remember_token`, `created_at`, `updated_at`) VALUES
(1, 'Dr. Candida Kuvalis', 'raynor.jovanny@example.org', '2026-05-26 20:35:05', '3', '$2y$12$UfupnBcsHORYFHGXFZNsh.AD0JoOD2FDwGZ3rv5/kvkNC0Y8yAonC', 'wGTnu1EGKq', '2026-05-26 20:35:05', '2026-05-26 20:35:05'),
(2, 'Chelsie Heathcote', 'efren.roob@example.org', '2026-05-26 20:35:05', '3', '$2y$12$UfupnBcsHORYFHGXFZNsh.AD0JoOD2FDwGZ3rv5/kvkNC0Y8yAonC', 'HhWOaSjDqQ', '2026-05-26 20:35:05', '2026-05-26 20:35:05'),
(3, 'Mr. Stan Wehner', 'ezra.dickinson@example.net', '2026-05-26 20:35:05', '3', '$2y$12$UfupnBcsHORYFHGXFZNsh.AD0JoOD2FDwGZ3rv5/kvkNC0Y8yAonC', 'Ra1568hNXm', '2026-05-26 20:35:05', '2026-05-26 20:35:05'),
(4, 'Audra Nikolaus', 'effertz.belle@example.org', '2026-05-26 20:35:05', '3', '$2y$12$UfupnBcsHORYFHGXFZNsh.AD0JoOD2FDwGZ3rv5/kvkNC0Y8yAonC', 'EZKAFAFMGW', '2026-05-26 20:35:05', '2026-05-26 20:35:05'),
(5, 'Sarah Durgan Jr.', 'kuphal.darren@example.net', '2026-05-26 20:35:05', '3', '$2y$12$UfupnBcsHORYFHGXFZNsh.AD0JoOD2FDwGZ3rv5/kvkNC0Y8yAonC', '6GYz1fQGRx', '2026-05-26 20:35:05', '2026-05-26 20:35:05'),
(6, 'Administrator', 'admin@example.com', '2026-05-26 20:43:39', '1', '$2y$12$tJkBsRBLHSGgcwu9sZ5bhuGKrpaCTNA/ZfgDYRgVCCZcxua3/FkFG', '0zMimRLG51', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(7, 'Prof. Zackery Gislason V', 'robb08@example.com', '2026-05-26 20:43:39', '3', '$2y$12$IQJ7f5Yok6FmdBlM4QZc5ub6JTseJJQIHGMLkQTpIMKT5NI92QsPa', 'dwgNkE63oi', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(8, 'Vern', 'vern@example.com', '2026-05-26 20:43:39', '3', '$2y$12$teU6P8IuGEmSkoRPjnxM6O5vl7y1qtmaQwAAsGd1qXqFYtwdeOrj6', 'cbDEsCj88H', '2026-05-26 20:43:39', '2026-06-01 21:39:19'),
(9, 'Nicolas Thompson', 'nicolas@example.org', '2026-05-26 20:43:39', '3', '$2y$12$cFeHELK6IRZJqlqt8i1s8uzRzgrboOXacgCOhoIQGJtQpCvP3hLp6', 'qqWIELWurr', '2026-05-26 20:43:39', '2026-06-03 22:46:27'),
(10, 'Dusty Dietrich', 'durgan.arianna@example.com', '2026-05-26 20:43:39', '3', '$2y$12$IQJ7f5Yok6FmdBlM4QZc5ub6JTseJJQIHGMLkQTpIMKT5NI92QsPa', '9LJRFh3cVH', '2026-05-26 20:43:39', '2026-05-26 20:43:39'),
(11, 'Danendra', 'danendraya@gmail.com', NULL, '2', '$2y$12$0Yfhe0aLSzzMvSh2y7nYF.pigTBeM9z0eBGNW8ZOLJnGBv2qqfRwK', NULL, '2026-05-29 22:09:54', '2026-05-29 22:09:54');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `cache`
--
ALTER TABLE `cache`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_expiration_index` (`expiration`);

--
-- Indexes for table `cache_locks`
--
ALTER TABLE `cache_locks`
  ADD PRIMARY KEY (`key`),
  ADD KEY `cache_locks_expiration_index` (`expiration`);

--
-- Indexes for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `failed_jobs_uuid_unique` (`uuid`);

--
-- Indexes for table `jobs`
--
ALTER TABLE `jobs`
  ADD PRIMARY KEY (`id`),
  ADD KEY `jobs_queue_index` (`queue`);

--
-- Indexes for table `job_batches`
--
ALTER TABLE `job_batches`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `migrations`
--
ALTER TABLE `migrations`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `password_reset_tokens`
--
ALTER TABLE `password_reset_tokens`
  ADD PRIMARY KEY (`email`);

--
-- Indexes for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `personal_access_tokens_token_unique` (`token`),
  ADD KEY `personal_access_tokens_tokenable_type_tokenable_id_index` (`tokenable_type`,`tokenable_id`),
  ADD KEY `personal_access_tokens_expires_at_index` (`expires_at`);

--
-- Indexes for table `sessions`
--
ALTER TABLE `sessions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `sessions_user_id_index` (`user_id`),
  ADD KEY `sessions_last_activity_index` (`last_activity`);

--
-- Indexes for table `tasks`
--
ALTER TABLE `tasks`
  ADD PRIMARY KEY (`id`),
  ADD KEY `tasks_assigned_user_id_foreign` (`assigned_user_id`),
  ADD KEY `tasks_created_by_foreign` (`created_by`),
  ADD KEY `tasks_status_priority_index` (`status`,`priority`);

--
-- Indexes for table `task_attachments`
--
ALTER TABLE `task_attachments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_attachments_task_id_foreign` (`task_id`);

--
-- Indexes for table `task_comments`
--
ALTER TABLE `task_comments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_comments_task_id_foreign` (`task_id`),
  ADD KEY `task_comments_user_id_foreign` (`user_id`);

--
-- Indexes for table `task_user`
--
ALTER TABLE `task_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `task_user_task_id_foreign` (`task_id`),
  ADD KEY `task_user_user_id_foreign` (`user_id`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `users_email_unique` (`email`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `failed_jobs`
--
ALTER TABLE `failed_jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `jobs`
--
ALTER TABLE `jobs`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT for table `migrations`
--
ALTER TABLE `migrations`
  MODIFY `id` int(10) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `personal_access_tokens`
--
ALTER TABLE `personal_access_tokens`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=32;

--
-- AUTO_INCREMENT for table `tasks`
--
ALTER TABLE `tasks`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- AUTO_INCREMENT for table `task_attachments`
--
ALTER TABLE `task_attachments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `task_comments`
--
ALTER TABLE `task_comments`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `task_user`
--
ALTER TABLE `task_user`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tasks`
--
ALTER TABLE `tasks`
  ADD CONSTRAINT `tasks_assigned_user_id_foreign` FOREIGN KEY (`assigned_user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL,
  ADD CONSTRAINT `tasks_created_by_foreign` FOREIGN KEY (`created_by`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `task_attachments`
--
ALTER TABLE `task_attachments`
  ADD CONSTRAINT `task_attachments_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `task_comments`
--
ALTER TABLE `task_comments`
  ADD CONSTRAINT `task_comments_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_comments_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;

--
-- Constraints for table `task_user`
--
ALTER TABLE `task_user`
  ADD CONSTRAINT `task_user_task_id_foreign` FOREIGN KEY (`task_id`) REFERENCES `tasks` (`id`) ON DELETE CASCADE,
  ADD CONSTRAINT `task_user_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
