
USE master;
GO


SELECT
    SERVERPROPERTY('IsIntegratedSecurityOnly') AS windows_only,
    SERVERPROPERTY('InstanceName')             AS instance_name;
GO


EXEC xp_instance_regwrite
     N'HKEY_LOCAL_MACHINE',
     N'Software\Microsoft\MSSQLServer\MSSQLServer',
     N'LoginMode',
     REG_DWORD,
     2;
GO

