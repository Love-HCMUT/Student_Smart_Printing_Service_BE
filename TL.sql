use ssps;

-- Thêm ràng buộc CHECK vào bảng account
ALTER TABLE account
ADD CONSTRAINT chk_fullName 
    CHECK (fullName REGEXP '^[A-Za-zÀ-ỹ\\s]{2,}$'),
ADD CONSTRAINT chk_username 
    CHECK (CHAR_LENGTH(username) BETWEEN 8 AND 20),
ADD CONSTRAINT chk_roles 
    CHECK (roles IN ('User', 'SPSO', 'Printing Staff'));

-- Thêm ràng buộc CHECK vào bảng staffPhoneNumbers
ALTER TABLE staffPhoneNumbers
ADD CONSTRAINT chk_phone_staff 
    CHECK (phoneNumber REGEXP '^[0-9]{10,11}$');

-- Thêm ràng buộc CHECK vào bảng spsoPhoneNumbers
ALTER TABLE spsoPhoneNumbers
ADD CONSTRAINT chk_phone_spso 
    CHECK (phoneNumber REGEXP '^[0-9]{10,11}$');

-- Thêm ràng buộc CHECK vào bảng printer
ALTER TABLE printer
ADD CONSTRAINT chk_status 
    CHECK (printerStatus IN ('Available', 'Unavailabl'));
