CREATE TABLE IF NOT EXISTS daily_closes (
  ticker TEXT NOT NULL,
  date   DATE NOT NULL,
  close  NUMERIC NOT NULL,
  PRIMARY KEY (ticker, date)
);