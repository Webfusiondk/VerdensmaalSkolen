USE [master]
GO

DECLARE @kill varchar(8000) = ''
SELECT @kill = @kill + 'kill ' + CONVERT(varchar(5), session_id) + ';'
FROM sys.dm_exec_sessions
WHERE database_id = DB_ID('ArduinoDB')

EXEC(@kill)
GO

DROP DATABASE IF EXISTS [ArduinoDB]
GO

CREATE DATABASE [ArduinoDB]
GO

USE [ArduinoDB]
GO


/*##################################################
				## Drop Tables ##
####################################################*/

DROP TABLE IF EXISTS [Temperature]
DROP TABLE IF EXISTS [Humidity]
DROP TABLE IF EXISTS [Light]
DROP TABLE IF EXISTS [Room]
DROP TABLE IF EXISTS [RoomReadings]
DROP TABLE IF EXISTS [SessionTokens]
GO


/*##################################################
				## Setup ##
####################################################*/

CREATE TABLE [Temperature](
[Id] int NOT NULL IDENTITY(1,1),
[Read] decimal(5,2))
GO

CREATE TABLE [Humidity](
[Id] int NOT NULL IDENTITY(1,1),
[Read] decimal(5,2))
GO

CREATE TABLE [Light](
[Id] int NOT NULL IDENTITY(1,1),
[Read] int,
[Status] TINYINT DEFAULT 0)

GO

CREATE TABLE [Room](
[RoomNr] VarChar(50) NOT NULL
)
GO

CREATE TABLE [RoomReadings](
[Id] int NOT NULL IDENTITY(1,1),
[Room_Nr] VarChar(50),
[Temperature_Id] int,
[Humidity_Id] int,
[Light_Id] int,
[Time] DateTime DEFAULT GETDATE())
GO

CREATE TABLE [SessionTokens](
[Token] VarChar(250) NOT NULL,
[Time] DateTime DEFAULT GETDATE())
GO


/*##################################################
				## Alter Data Tables ##
####################################################*/

ALTER TABLE [Temperature]
ADD
	PRIMARY KEY ([Id])
GO

ALTER TABLE [Humidity]
ADD
	PRIMARY KEY ([Id])
GO

ALTER TABLE [Light]
ADD
	PRIMARY KEY ([Id])
GO

ALTER TABLE [Room]
ADD
	PRIMARY KEY ([RoomNr])
GO

ALTER TABLE [RoomReadings]
ADD
	PRIMARY KEY ([Id]),
	FOREIGN KEY ([Room_Nr]) REFERENCES [Room] ([RoomNr]),
	FOREIGN KEY ([Temperature_Id]) REFERENCES [Temperature] ([Id]),
	FOREIGN KEY ([Humidity_Id]) REFERENCES [Humidity] ([Id]),
	FOREIGN KEY ([Light_Id]) REFERENCES [Light] ([Id])
GO

ALTER TABLE [SessionTokens]
ADD
	PRIMARY KEY ([Token])
GO


/*##################################################
				## Drop Stored Procedures ##
####################################################*/

DROP PROCEDURE IF EXISTS [spGetAll]
DROP PROCEDURE IF EXISTS [spGetReadingByRoomNr]
DROP PROCEDURE IF EXISTS [spInsertSensorData]
DROP PROCEDURE IF EXISTS [spSelectToken]
DROP PROCEDURE IF EXISTS [spDeleteOldTokens]
DROP PROCEDURE IF EXISTS [spUpdateSessionToken]
DROP PROCEDURE IF EXISTS [spDeleteOldSessionTokens]
GO


/*##################################################
				## Create Stored Procedures ##
####################################################*/

CREATE PROCEDURE [spSelectToken](
@token Varchar(250)
)
AS
DECLARE @Tname varchar(20) = 'SelectToken'
BEGIN
	BEGIN TRAN @TName;
	BEGIN TRY
		
		SELECT * FROM [SessionTokens]
		WHERE [Token] = @token
		
		COMMIT TRANSACTION @TName;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN @TName;
		END
	END CATCH
END;
GO
	

CREATE PROCEDURE [spGetAll]
AS
DECLARE @TName varchar(20) = 'GetAll';
BEGIN
	BEGIN TRAN @TName;
	BEGIN TRY
		
		SELECT * FROM RoomReadings
		INNER JOIN [Room] on [RoomReadings].[Room_Nr] = [Room].[RoomNr]
		INNER JOIN [Temperature] ON [RoomReadings].[Temperature_Id] = [Temperature].[Id]
		INNER JOIN [Humidity] ON [RoomReadings].[Humidity_Id] = [Humidity].[Id]
		INNER JOIN [Light] ON [RoomReadings].[Light_Id] = [Light].[Id]
		
		COMMIT TRANSACTION @TName;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN @TName;
		END
	END CATCH
END;
GO

CREATE PROCEDURE [spGetReadingByRoomNr](
	@roomNr varchar(50))
AS
DECLARE @TName varchar(20) = 'GetByRoomNr';
BEGIN
	BEGIN TRAN @TName;
	BEGIN TRY

		SELECT * FROM [RoomReadings]
		INNER JOIN [Temperature] ON [RoomReadings].[Temperature_Id] = [Temperature].[Id]
		INNER JOIN [Humidity] ON [RoomReadings].[Humidity_Id] = [Humidity].[Id]
		INNER JOIN [Light] ON [RoomReadings].[Light_Id] = [Light].[Id]
		WHERE [Room_Nr] = @roomNr;

		COMMIT TRANSACTION @TName;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN @TName;
		END
	END CATCH
END;
GO

CREATE PROCEDURE [spInsertSensorData](
@roomNr varchar(50),
@temperature decimal,
@humidity decimal,
@light int
)
AS
DECLARE @TName varchar(20) = 'InsertSensorData';
BEGIN
	BEGIN TRAN @TName;
	BEGIN TRY

		INSERT INTO [Temperature] ([Read]) VALUES (@temperature);
		DECLARE @TempID int = @@IDENTITY;
		
		INSERT INTO [Humidity] ([Read]) VALUES (@humidity);
		DECLARE @HumidityID int = @@IDENTITY;
		
		INSERT INTO [Light] ([Read]) VALUES (@light);
		DECLARE @LightID int = @@IDENTITY;
		
		INSERT INTO [RoomReadings] ([Room_Nr], [Temperature_Id], [Humidity_Id], [Light_Id]) VALUES (@roomNr,  @TempID, @HumidityID, @LightID);
		
		COMMIT TRANSACTION @TName;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN @TName;
		END
	END CATCH
END;
GO

CREATE PROCEDURE [spDeleteOldSessionTokens]
AS
DECLARE @TName varchar(20) = 'DeleteOldSessionTokens';
BEGIN
	BEGIN TRAN @TName;
	BEGIN TRY
		
		DELETE FROM [SessionTokens]
		WHERE (DATEDIFF(MINUTE, [Time], GETDATE())) >= 15

		COMMIT TRANSACTION @TName;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN @TName;
		END
	END CATCH
END;
GO

CREATE PROCEDURE [spUpdateSessionToken](
@token VarChar(250)
)
AS
DECLARE @TName varchar(20) = 'UpdateSessionToken';
BEGIN
	BEGIN TRAN @TName;
	BEGIN TRY

		UPDATE [SessionTokens]
		SET [Time] = GETDATE()
		WHERE [Token] = @token
		
		COMMIT TRANSACTION @TName;
	END TRY
	BEGIN CATCH
		IF @@TRANCOUNT > 0
		BEGIN
			ROLLBACK TRAN @TName;
		END
	END CATCH
END;
GO


/*##################################################
				## Room Table Data ##
####################################################*/

INSERT INTO [Room]([RoomNr])
VALUES
('A.01'),
('A.02'),
('A.03'),
('A.04'),
('A.05'),
('A.06'),
('A.10'),
('A.12'),
('A1.01'),
('A1.02'),
('A1.03'),
('A1.04'),
('A1.06'),
('A1.07'),
('A1.11'),
('A1.13'),
('A1.14'),
('A1.17'),
('A1.17a'),
('A1.19'),
('A1.21'),
('A1.22'),
('A1.23'),
('A1.24'),
('A1.25'),
('A1.26'),
('A1.27'),
('A1.31'),
('A1.32'),
('B.01'),
('B.02'),
('B.11'),
('B.21'),
('B.23'),
('B.25'),
('B.14'),
('B.16'),
('B.24'),
('B.26'),
('B.30'),
('C.08'),
('C.20'),
('C.30'),
('C.32'),
('C.33'),
('C.35'),
('C.31'),
('C.23'),
('C.17'),
('C.15'),
('C.11'),
('D.05'),
('D.08'),
('D.09'),
('D.10'),
('D.11'),
('D.12'),
('D.13'),
('D.15')
GO
