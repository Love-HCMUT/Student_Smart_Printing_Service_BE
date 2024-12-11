-- ALTER TABLE paymentLog MODIFY paymentTime TIMESTAMP NOT NULL;
ALTER TABLE paymentLog ADD CONSTRAINT check_money CHECK (money > 0);
-- ALTER TABLE paymentLog ADD CONSTRAINT chk_paymentTime CHECK (ABS(TIMESTAMPDIFF(MINUTE, paymentTime, CURRENT_TIMESTAMP)) <= 2);


-- ALTER TABLE depositLog ADD CONSTRAINT chk_customerID CHECK (customerID > 0);

ALTER TABLE depositCombo ADD CONSTRAINT chk_quantity CHECK (quantity > 0);
-- ALTER TABLE depositCombo ADD CONSTRAINT chk_comboid CHECK (comboID > 0);

ALTER TABLE combo ADD CONSTRAINT chk_price CHECK (price > 0);
ALTER TABLE combo ADD CONSTRAINT chk_coin CHECK (numCoins > 0);

