CREATE TABLE Vehicles (
    VehicleId SERIAL PRIMARY KEY,
    Make VARCHAR(50),
    Model VARCHAR(50),
    Year INT,
    WeightLbs INT
);

CREATE TABLE Batteries (
    BatteryId SERIAL PRIMARY KEY,
    CapacityKWh NUMERIC,
    WeightLbs INT,
    Cost NUMERIC
);

CREATE TABLE Motors (
    MotorId SERIAL PRIMARY KEY,
    Name VARCHAR(100),
    PowerKW INT,
    TorqueNM INT,
    Cost NUMERIC
);

CREATE TABLE Projects (
    ProjectId SERIAL PRIMARY KEY,
    Name VARCHAR(100),
    VehicleId INT,
    BatteryId INT,
    MotorId INT
);
