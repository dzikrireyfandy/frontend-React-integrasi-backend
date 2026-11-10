
USE review_kantin;
GO

-- ---------------------------------------------------------------- USERS
INSERT INTO dbo.USERS (name, email, password_hash, role) VALUES
('Admin Utama',    'admin@kantin.test',      '$2b$10$CwTycUXWue0Thq9StjUM0uJ8Z3G8cUeg6c4X.aVsK3W2VLXKzJmpe', 'admin'),
('Budi Owner',     'budi.owner@kantin.test', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8Z3G8cUeg6c4X.aVsK3W2VLXKzJmpe', 'owner'),
('Siti Owner',     'siti.owner@kantin.test', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8Z3G8cUeg6c4X.aVsK3W2VLXKzJmpe', 'owner'),
('Joko Owner',     'joko.owner@kantin.test', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8Z3G8cUeg6c4X.aVsK3W2VLXKzJmpe', 'owner'),
('Andi Customer',  'andi@kantin.test',       '$2b$10$CwTycUXWue0Thq9StjUM0uJ8Z3G8cUeg6c4X.aVsK3W2VLXKzJmpe', 'customer'),
('Rani Customer',  'rani@kantin.test',       '$2b$10$CwTycUXWue0Thq9StjUM0uJ8Z3G8cUeg6c4X.aVsK3W2VLXKzJmpe', 'customer'),
('Dedi Customer',  'dedi@kantin.test',       '$2b$10$CwTycUXWue0Thq9StjUM0uJ8Z3G8cUeg6c4X.aVsK3W2VLXKzJmpe', 'customer'),
('Nadia Customer', 'nadia@kantin.test',      '$2b$10$CwTycUXWue0Thq9StjUM0uJ8Z3G8cUeg6c4X.aVsK3W2VLXKzJmpe', 'customer'),
('Fajar Customer', 'fajar@kantin.test',      '$2b$10$CwTycUXWue0Thq9StjUM0uJ8Z3G8cUeg6c4X.aVsK3W2VLXKzJmpe', 'customer'),
('Wulan Customer', 'wulan@kantin.test',      '$2b$10$CwTycUXWue0Thq9StjUM0uJ8Z3G8cUeg6c4X.aVsK3W2VLXKzJmpe', 'customer');
GO

-- --------------------------------------------------------------- STALLS
-- owner_id 2 = Budi, 3 = Siti, 4 = Joko
INSERT INTO dbo.STALLS (owner_id, name, category, location, description) VALUES
(2, 'Kwetiau Goreng Alif',        'Mie & Kwetiau', 'Kantin Alif FKIP', 'Kwetiau goreng khas dengan bumbu spesial'),
(2, 'Bakso Pasca',                'Bakso',         'Kantin Pasca',     'Bakso urat & bakso halus'),
(3, 'Chicken Steak Hotplate',     'Western',       'Kantin FK',        'Chicken steak hotplate dengan saus blackpepper'),
(3, 'Nasi Padang Sederhana',      'Nasi Padang',   'Kantin Teknik',    'Aneka lauk khas padang'),
(2, 'Es Teh & Jajanan Manis',     'Minuman',       'Kantin Alif FKIP', 'Minuman dingin dan gorengan'),
(4, 'Mie Ayam Pak Joko',          'Mie & Kwetiau', 'Kantin Teknik',    'Mie ayam pangsit legendaris kampus'),
(4, 'Nasi Goreng Gerobak',        'Nasi Goreng',   'Kantin Pasca',     'Nasi goreng gerobak buka sampai malam'),
(3, 'Sate Ayam Bu Siti',          'Sate',          'Kantin FK',        'Sate ayam bumbu kacang khas Madura'),
(2, 'Jus Buah Segar',             'Minuman',       'Kantin Alif FKIP', 'Aneka jus buah segar tanpa pengawet'),
(4, 'Warung Soto Betawi',         'Soto',          'Kantin Teknik',    'Soto betawi santan gurih');
GO

-- ----------------------------------------------------------- MENU_ITEMS
INSERT INTO dbo.MENU_ITEMS (stall_id, name, price, is_available) VALUES
(1, 'Kwetiau Goreng Biasa',        15000, 1),
(1, 'Kwetiau Goreng Seafood',      20000, 1),
(1, 'Kwetiau Kuah',                15000, 1),
(2, 'Bakso Urat',                  12000, 1),
(2, 'Bakso Halus',                 10000, 1),
(2, 'Bakso Jumbo',                 18000, 1),
(3, 'Chicken Steak Original',      22000, 1),
(3, 'Chicken Steak Blackpepper',   25000, 0),
(3, 'Chicken Steak Mushroom',      25000, 1),
(4, 'Nasi Rendang',                18000, 1),
(4, 'Nasi Ayam Pop',               16000, 1),
(4, 'Nasi Gulai Tunjang',          20000, 1),
(5, 'Es Teh Manis',                5000,  1),
(5, 'Pisang Goreng',               8000,  1),
(6, 'Mie Ayam Biasa',              12000, 1),
(6, 'Mie Ayam Pangsit',            15000, 1),
(7, 'Nasi Goreng Spesial',         16000, 1),
(7, 'Nasi Goreng Telur',           13000, 0),
(8, 'Sate Ayam 10 Tusuk',          17000, 1),
(8, 'Sate Ayam 15 Tusuk',          23000, 1),
(9, 'Jus Alpukat',                 12000, 1),
(9, 'Jus Mangga',                  10000, 1),
(10, 'Soto Betawi Daging',         20000, 1),
(10, 'Soto Betawi Campur',         22000, 1);
GO

-- -------------------------------------------------------------- REVIEWS
-- 1 user cuma boleh 1 review per stall (UNIQUE user_id + stall_id)
INSERT INTO dbo.REVIEWS (stall_id, user_id, rating, comment, like_count) VALUES
(1, 5, 5, 'Enak banget, porsinya juga banyak', 0),
(1, 6, 4, 'Rasanya oke tapi agak lama nunggunya', 0),
(1, 7, 5, 'Favorit gue tiap minggu', 0),
(2, 5, 5, 'Baksonya juara, kuahnya gurih', 0),
(2, 9, 4, 'Enak, tapi porsi bakso jumbo agak kemahalan', 0),
(3, 8, 3, 'Standar aja, sausnya kurang nendang', 0),
(3, 10, 4, 'Chicken steaknya juicy, mayan buat lunch', 0),
(4, 6, 5, 'Rendangnya mantap, harga bersahabat', 0),
(4, 7, 3, 'Antriannya lumayan panjang pas jam makan siang', 0),
(5, 9, 4, 'Es tehnya seger, pas buat cuaca panas', 0),
(6, 5, 5, 'Mie ayam pangsitnya top, kuahnya kaldu banget', 0),
(6, 8, 4, 'Enak tapi mienya kadang kelembekan', 0),
(7, 6, 4, 'Nasi goreng gerobak favorit anak kosan', 0),
(8, 10, 5, 'Sate ayamnya empuk, bumbu kacangnya kental', 0),
(9, 7, 4, 'Jus alpukatnya kental dan nggak encer', 0),
(10, 9, 5, 'Soto betawinya autentik, santannya berasa', 0);
GO

-- ---------------------------------------------------------------- LIKES
INSERT INTO dbo.LIKES (review_id, user_id) VALUES
(1, 6), (1, 7), (1, 8),
(3, 9), (3, 10),
(4, 6), (4, 10),
(6, 5),
(8, 9), (8, 10),
(11, 6), (11, 7),
(14, 5), (14, 6), (14, 7);
GO

-- ---------------------------------------------------------------- FLAGS
INSERT INTO dbo.FLAGS (review_id, reported_by, reason, status) VALUES
(2, 6, 'Komentar dianggap spam', 'pending'),
(9, 5, 'Review tidak relevan', 'pending'),
(1, 6, 'Testing laporan review', 'dismissed'),
(6, 4, 'Bahasa kurang sopan', 'resolved'),
(12, 4, 'Duplikat review', 'pending'),
(7, 8, 'Diduga review palsu', 'pending'),
(13, 9, 'Konten tidak sesuai', 'resolved'),
(15, 10, 'Spam promosi', 'dismissed');
GO

-- ----------------------------------------------------------- AUDIT_LOGS
INSERT INTO dbo.AUDIT_LOGS (user_id, action, target_table, target_id, metadata) VALUES
(1, 'CREATE', 'STALLS',      1,  '{"note":"seed awal"}'),
(1, 'CREATE', 'STALLS',      6,  '{"note":"seed awal"}'),
(1, 'UPDATE', 'FLAGS',       4,  '{"status":"resolved"}'),
(1, 'UPDATE', 'FLAGS',       7,  '{"status":"resolved"}'),
(2, 'CREATE', 'MENU_ITEMS',  1,  '{"note":"seed awal"}'),
(3, 'CREATE', 'MENU_ITEMS',  7,  '{"note":"seed awal"}'),
(4, 'CREATE', 'MENU_ITEMS',  15, '{"note":"seed awal"}'),
(1, 'DELETE', 'LIKES',       2,  '{"note":"contoh log delete"}'),
(2, 'CREATE', 'STALLS',      2,  '{"note":"seed awal"}'),
(4, 'CREATE', 'STALLS',      10, '{"note":"seed awal"}');
GO

-- Sinkronkan avg_rating & review_count di STALLS berdasarkan data review di atas
UPDATE s
SET s.review_count = agg.cnt,
    s.avg_rating = agg.avg_rating
FROM dbo.STALLS s
JOIN (
    SELECT stall_id, COUNT(*) AS cnt, CAST(AVG(CAST(rating AS DECIMAL(3,2))) AS DECIMAL(3,2)) AS avg_rating
    FROM dbo.REVIEWS
    GROUP BY stall_id
) agg ON agg.stall_id = s.id;
GO

-- Sinkronkan like_count di REVIEWS berdasarkan data likes di atas
UPDATE r
SET r.like_count = agg.cnt
FROM dbo.REVIEWS r
JOIN (
    SELECT review_id, COUNT(*) AS cnt
    FROM dbo.LIKES
    GROUP BY review_id
) agg ON agg.review_id = r.id;
GO

PRINT 'Seed data selesai.';
GO
