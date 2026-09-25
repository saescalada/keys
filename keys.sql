-- phpMyAdmin SQL Dump
-- version 5.2.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Sep 07, 2026 at 01:53 AM
-- Server version: 8.4.3
-- PHP Version: 8.3.26

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `keys`
--

-- --------------------------------------------------------

--
-- Table structure for table `llaves`
--

CREATE TABLE `llaves` (
  `id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `codigo` varchar(50) DEFAULT NULL,
  `ubicacion` varchar(100) DEFAULT NULL,
  `estado` enum('DISPONIBLE','RETIRADA','INACTIVA') NOT NULL DEFAULT 'DISPONIBLE',
  `activo` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `llaves`
--

INSERT INTO `llaves` (`id`, `nombre`, `codigo`, `ubicacion`, `estado`, `activo`) VALUES
(1, 'Aula 101', 'A101', 'Planta Baja', 'DISPONIBLE', 1),
(2, 'Aula 102', 'A102', 'Planta Baja', 'RETIRADA', 1),
(3, 'Aula 103', 'A103', 'Planta Baja', 'RETIRADA', 1),
(4, 'Aula 201', 'A201', 'Planta Alta', 'RETIRADA', 1),
(5, 'Aula 202', 'A202', 'Planta Alta', 'DISPONIBLE', 1),
(6, 'Laboratorio 1', 'LAB01', 'Planta Alta', 'DISPONIBLE', 1),
(7, 'Laboratorio 2', 'LAB02', 'Planta Alta', 'DISPONIBLE', 1),
(8, 'Biblioteca', 'BIB01', 'Planta Baja', 'DISPONIBLE', 1),
(9, 'Dirección', 'DIR01', 'Planta Baja', 'DISPONIBLE', 1),
(10, 'Sala de Profesores', 'SP01', 'Planta Alta', 'DISPONIBLE', 1);

-- --------------------------------------------------------

--
-- Table structure for table `movimientos`
--

CREATE TABLE `movimientos` (
  `id` int NOT NULL,
  `llave_id` int NOT NULL,
  `persona_id` int NOT NULL,
  `tipo` enum('RETIRO','DEVOLUCION') NOT NULL,
  `fecha_hora` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `movimientos`
--

INSERT INTO `movimientos` (`id`, `llave_id`, `persona_id`, `tipo`, `fecha_hora`) VALUES
(1, 1, 1, 'RETIRO', '2026-08-25 14:48:52'),
(2, 1, 1, 'RETIRO', '2026-08-25 14:58:44'),
(3, 1, 1, 'DEVOLUCION', '2026-08-25 15:00:12'),
(4, 1, 1, 'RETIRO', '2026-08-25 16:41:23'),
(5, 1, 2, 'DEVOLUCION', '2026-08-25 16:44:46'),
(6, 1, 5, 'RETIRO', '2026-08-27 15:37:21'),
(7, 1, 2, 'DEVOLUCION', '2026-08-27 15:37:56'),
(8, 1, 6, 'RETIRO', '2026-08-27 15:49:45'),
(9, 2, 4, 'RETIRO', '2026-08-27 15:49:56'),
(10, 1, 7, 'DEVOLUCION', '2026-08-27 15:50:25'),
(11, 1, 6, 'RETIRO', '2026-08-27 16:18:59'),
(12, 3, 4, 'RETIRO', '2026-08-27 16:19:05'),
(13, 4, 5, 'RETIRO', '2026-08-27 16:19:19'),
(14, 2, 6, 'DEVOLUCION', '2026-08-27 16:19:45'),
(15, 2, 5, 'RETIRO', '2026-08-27 16:19:49'),
(16, 5, 3, 'RETIRO', '2026-08-27 16:36:41'),
(17, 5, 6, 'DEVOLUCION', '2026-08-27 16:36:51'),
(18, 1, 3, 'DEVOLUCION', '2026-08-27 17:07:14'),
(19, 1, 3, 'RETIRO', '2026-08-27 17:07:19'),
(20, 1, 3, 'DEVOLUCION', '2026-08-27 17:07:23');

-- --------------------------------------------------------

--
-- Table structure for table `personas`
--

CREATE TABLE `personas` (
  `id` int NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `dni` varchar(20) DEFAULT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `personas`
--

INSERT INTO `personas` (`id`, `nombre`, `apellido`, `dni`, `activo`) VALUES
(1, 'Juan', 'Perez', '35123456', 1),
(2, 'Maria', 'Gonzalez', '36234567', 1),
(3, 'Pedro', 'Rodriguez', '37456789', 1),
(4, 'Ana', 'Martinez', '38456789', 1),
(5, 'Carlos', 'Gomez', '39567890', 1),
(6, 'Lucas', 'Gomez Modificado', '40111222', 1),
(7, 'Escalada', 'Santiago', '41091523', 1);

-- --------------------------------------------------------

--
-- Table structure for table `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int NOT NULL,
  `usuario` varchar(50) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `activo` tinyint(1) NOT NULL DEFAULT '1',
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Dumping data for table `usuarios`
--

INSERT INTO `usuarios` (`id`, `usuario`, `password_hash`, `nombre`, `activo`, `created_at`) VALUES
(1, 'admin', '$2b$10$tye1WyL67jOXTCvFsIxH4uskeyFZJdP0wpN6OkXhNCfMIoy.SyZpe', 'Administrador', 1, '2026-08-26 14:35:31');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `llaves`
--
ALTER TABLE `llaves`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `codigo` (`codigo`);

--
-- Indexes for table `movimientos`
--
ALTER TABLE `movimientos`
  ADD PRIMARY KEY (`id`),
  ADD KEY `llave_id` (`llave_id`),
  ADD KEY `persona_id` (`persona_id`);

--
-- Indexes for table `personas`
--
ALTER TABLE `personas`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `dni` (`dni`);

--
-- Indexes for table `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `usuario` (`usuario`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `llaves`
--
ALTER TABLE `llaves`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `movimientos`
--
ALTER TABLE `movimientos`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `personas`
--
ALTER TABLE `personas`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `movimientos`
--
ALTER TABLE `movimientos`
  ADD CONSTRAINT `movimientos_ibfk_1` FOREIGN KEY (`llave_id`) REFERENCES `llaves` (`id`),
  ADD CONSTRAINT `movimientos_ibfk_2` FOREIGN KEY (`persona_id`) REFERENCES `personas` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
