
CREATE TABLE IF NOT EXISTS disciplines (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(150) NOT NULL,
    credits INT NOT NULL,
    semester INT NOT NULL,
    description TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT chk_disciplines_credits
        CHECK (credits BETWEEN 1 AND 60),

    CONSTRAINT chk_disciplines_semester
        CHECK (semester BETWEEN 1 AND 12)
);

CREATE INDEX idx_disciplines_semester
ON disciplines(semester);
