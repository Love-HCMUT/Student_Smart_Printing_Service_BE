DELIMITER //

DROP PROCEDURE IF EXISTS UpdateCustomerBalance //

CREATE PROCEDURE UpdateCustomerBalance(
    IN customerId INT,
    IN addedBalance INT
)
BEGIN
    DECLARE currentBalance INT;
    DECLARE isSuccess BOOL;

    -- Kiểm tra khách hàng có tồn tại hay không
    SELECT balance INTO currentBalance
    FROM customer
    WHERE id = customerId;

    IF currentBalance IS NULL THEN
        -- Nếu không tìm thấy khách hàng, đặt isSuccess là FALSE
        SET isSuccess = FALSE;
    ELSE
        -- Tính toán số dư mới
        SET currentBalance = currentBalance + addedBalance;

        -- Cập nhật số dư
        UPDATE customer
        SET balance = currentBalance
        WHERE id = customerId;

        -- Đặt isSuccess là TRUE
        SET isSuccess = TRUE;
    END IF;

    SELECT isSuccess as isSuccess;
END //

DELIMITER ;
