insert into bufet_cuser (
   id,
   name,
   email,
   is_superuser,
   is_active,
   is_cashier,
   is_staff,
   password,
   date_joined
) values ('2137', 'admin', 'admin@gamil.com', true, true, true, true, '', '2000-01-01 21:37:00+02');

insert into js_user_password_hashes (
   user_id,
   hash
) values ('2137', 'AAAAIAAAJxDuK/fJ68nb2rqp5jc8hRImO8+itfjWLRJHUkRMFJttJ/P7Kh3D/Rzkas6NeQEDuN/zM3Y7GMbFlsGanLulSCx4IIy8uefuc9sXT5QV+Griq6wcigswIJlqPRXvw8Kdljw=');

-- Kategorie produktów
insert into bufet_productcategory (
   category_id,
   name
) values ( 1,
           'Batony' ),( 2,
                        'Owoce' ),( 3,
                                    'Ciepłe napoje' ),( 4,
                                                        'Zimne napoje' ),( 5,
                                                                           'Przekąski' ),( 6,
                                                                                           'Desery' );

-- Produkty
insert into bufet_product (
   product_id,
   name,
   price,
   cost,
   margin,
   active,
   category_id
) values ( 1,
           'Baton czekoladowy',
           3.50,
           2.00,
           43,
           true,
           1 ),( 2,
                 'Baton musli',
                 4.00,
                 2.20,
                 45,
                 true,
                 1 ),( 3,
                       'Jabłko świeże',
                       2.00,
                       1.00,
                       50,
                       true,
                       2 ),( 4,
                             'Banan',
                             2.50,
                             1.20,
                             52,
                             true,
                             2 ),( 5,
                                   'Kawa czarna',
                                   6.00,
                                   2.50,
                                   58,
                                   true,
                                   3 ),( 6,
                                         'Herbata zielona',
                                         5.00,
                                         2.00,
                                         60,
                                         false,
                                         3 ),( 7,
                                               'Herbata czarna',
                                               5.00,
                                               2.00,
                                               60,
                                               true,
                                               3 ),( 8,
                                                     'Sok pomarańczowy',
                                                     4.50,
                                                     2.00,
                                                     55,
                                                     true,
                                                     4 ),( 9,
                                                           'Woda mineralna',
                                                           3.00,
                                                           1.00,
                                                           67,
                                                           true,
                                                           4 ),( 10,
                                                                 'Chipsy solone',
                                                                 4.50,
                                                                 2.20,
                                                                 51,
                                                                 true,
                                                                 5 ),( 11,
                                                                       'Orzeszki ziemne',
                                                                       5.00,
                                                                       2.50,
                                                                       50,
                                                                       true,
                                                                       5 ),( 12,
                                                                             'Ciastko czekoladowe',
                                                                             6.50,
                                                                             3.00,
                                                                             54,
                                                                             true,
                                                                             6 ),( 13,
                                                                                   'Jogurt naturalny',
                                                                                   4.00,
                                                                                   1.80,
                                                                                   55,
                                                                                   false,
                                                                                   6 ),( 14,
                                                                                         'Baton kokosowy',
                                                                                         3.80,
                                                                                         2.10,
                                                                                         44,
                                                                                         true,
                                                                                         1 ),( 15,
                                                                                               'Gruszka świeża',
                                                                                               2.20,
                                                                                               1.10,
                                                                                               50,
                                                                                               true,
                                                                                               2 ),( 16,
                                                                                                     'Herbata owocowa',
                                                                                                     5.50,
                                                                                                     2.20,
                                                                                                     60,
                                                                                                     true,
                                                                                                     3 ),( 17,
                                                                                                           'Kakao z mlekiem',
                                                                                                           6.50,
                                                                                                           3.00,
                                                                                                           54,
                                                                                                           true,
                                                                                                           3 ),( 18,
                                                                                                                 'Lemoniada cytrynowa'
                                                                                                                 ,
                                                                                                                 4.00,
                                                                                                                 1.80,
                                                                                                                 55,
                                                                                                                 true,
                                                                                                                 4 ),( 19,
                                                                                                                       'Smoothie truskawkowe'
                                                                                                                       ,
                                                                                                                       7.00,
                                                                                                                       3.50,
                                                                                                                       50,
                                                                                                                       true,
                                                                                                                       4 ),( 20
                                                                                                                       ,
                                                                                                                         'Popcorn maślany'
                                                                                                                         ,
                                                                                                                         4.00
                                                                                                                         ,
                                                                                                                         1.90
                                                                                                                         ,
                                                                                                                         53,
                                                                                                                         true
                                                                                                                         ,
                                                                                                                         5 ),
                                                                                                                         ( 21
                                                                                                                         ,
                                                                                                                           'Ciastko owsiane'
                                                                                                                           ,
                                                                                                                           5.50
                                                                                                                           ,
                                                                                                                           2.50
                                                                                                                           ,
                                                                                                                           55
                                                                                                                           ,
                                                                                                                           true
                                                                                                                           ,
                                                                                                                           6 )
                                                                                                                           ,(
                                                                                                                           22
                                                                                                                           ,
                                                                                                                             'Serek homogenizowany'
                                                                                                                             ,
                                                                                                                             3.50
                                                                                                                             ,
                                                                                                                             1.50
                                                                                                                             ,
                                                                                                                             57
                                                                                                                             ,
                                                                                                                             true
                                                                                                                             ,
                                                                                                                             6
                                                                                                                             )
                                                                                                                             ,
                                                                                                                             (
                                                                                                                             23
                                                                                                                             ,
                                                                                                                               'Orzechy mieszane'
                                                                                                                               ,
                                                                                                                               6.00
                                                                                                                               ,
                                                                                                                               3.00
                                                                                                                               ,
                                                                                                                               50
                                                                                                                               ,
                                                                                                                               true
                                                                                                                               ,
                                                                                                                               5
                                                                                                                               )
                                                                                                                               ;

-- Alergeny
insert into bufet_allergen (
   allergen_id,
   name
) values ( 1,
           'Orzechy' ),( 2,
                         'Gluten' ),( 3,
                                      'Laktoza' ),( 4,
                                                    'Kofeina' ),( 5,
                                                                  'Soja' );

-- Powiązania alergenów z produktami
insert into bufet_contactallergens (
   in_allergen_id,
   allergen_id,
   product_id
) values ( 1,
           1,
           1 ),( 2,
                 2,
                 1 ),( 3,
                       5,
                       1 ),( 4,
                             2,
                             2 ),( 5,
                                   1,
                                   11 ),( 6,
                                          4,
                                          5 ),( 7,
                                                4,
                                                6 ),( 8,
                                                      3,
                                                      12 ),( 9,
                                                             3,
                                                             13 ),( 10,
                                                                    2,
                                                                    14 ),( 11,
                                                                           3,
                                                                           17 ),( 12,
                                                                                  3,
                                                                                  22 ),( 13,
                                                                                         1,
                                                                                         23 ),( 14,
                                                                                                1,
                                                                                                20 );

-- Stan magazynowy produktów
insert into bufet_productstock (
   stock_id,
   amount,
   last_updated,
   product_id
) values ( 1,
           50,
           '2025-06-05 10:00:00+02',
           1 ),( 2,
                 40,
                 '2025-06-06 11:00:00+02',
                 2 ),( 3,
                       100,
                       '2025-06-09 09:00:00+02',
                       3 ),( 4,
                             80,
                             '2025-06-09 10:00:00+02',
                             4 ),( 5,
                                   80,
                                   '2025-06-08 08:00:00+02',
                                   5 ),( 6,
                                         70,
                                         '2025-06-07 14:00:00+02',
                                         6 ),( 7,
                                               75,
                                               '2025-06-07 14:30:00+02',
                                               7 ),( 8,
                                                     60,
                                                     '2025-06-06 12:00:00+02',
                                                     8 ),( 9,
                                                           120,
                                                           '2025-06-09 15:00:00+02',
                                                           9 ),( 10,
                                                                 90,
                                                                 '2025-06-08 13:00:00+02',
                                                                 10 ),( 11,
                                                                        60,
                                                                        '2025-06-08 13:00:00+02',
                                                                        11 ),( 12,
                                                                               50,
                                                                               '2025-06-07 12:00:00+02',
                                                                               12 ),( 13,
                                                                                      70,
                                                                                      '2025-06-07 12:30:00+02',
                                                                                      13 ),( 14,
                                                                                             55,
                                                                                             '2025-06-09 16:00:00+02',
                                                                                             14 ),( 15,
                                                                                                    75,
                                                                                                    '2025-06-09 16:30:00+02',
                                                                                                    15 ),( 16,
                                                                                                           65,
                                                                                                           '2025-06-08 17:00:00+02'
                                                                                                           ,
                                                                                                           16 ),( 17,
                                                                                                                  70,
                                                                                                                  '2025-06-08 17:30:00+02'
                                                                                                                  ,
                                                                                                                  17 ),( 18,
                                                                                                                         80,
                                                                                                                         '2025-06-07 18:00:00+02'
                                                                                                                         ,
                                                                                                                         18 )
                                                                                                                         ,( 19
                                                                                                                         ,
                                                                                                                            50
                                                                                                                            ,
                                                                                                                            '2025-06-07 18:30:00+02'
                                                                                                                            ,
                                                                                                                            19
                                                                                                                            )
                                                                                                                            ,
                                                                                                                            (
                                                                                                                            20
                                                                                                                            ,
                                                                                                                               85
                                                                                                                               ,
                                                                                                                               '2025-06-06 19:00:00+02'
                                                                                                                               ,
                                                                                                                               20
                                                                                                                               )
                                                                                                                               ,
                                                                                                                               (
                                                                                                                               21
                                                                                                                               ,
                                                                                                                                  60
                                                                                                                                  ,
                                                                                                                                  '2025-06-06 19:30:00+02'
                                                                                                                                  ,
                                                                                                                                  21
                                                                                                                                  )
                                                                                                                                  ,
                                                                                                                                  (
                                                                                                                                  22
                                                                                                                                  ,
                                                                                                                                     90
                                                                                                                                     ,
                                                                                                                                     '2025-06-05 20:00:00+02'
                                                                                                                                     ,
                                                                                                                                     22
                                                                                                                                     )
                                                                                                                                     ,
                                                                                                                                     (
                                                                                                                                     23
                                                                                                                                     ,
                                                                                                                                        45
                                                                                                                                        ,
                                                                                                                                        '2025-06-05 20:30:00+02'
                                                                                                                                        ,
                                                                                                                                        23
                                                                                                                                        )
                                                                                                                                        ;

-- Zamówienia
insert into bufet_order (
   order_id,
   date,
   sum,
   total_profit
) values ( 1,
           '2025-06-10 09:30:00+02',
           28.00,
           12.00 ),( 2,
                     '2025-06-10 11:00:00+02',
                     34.50,
                     15.50 ),( 3,
                               '2025-06-10 12:15:00+02',
                               22.00,
                               9.80 ),( 4,
                                        '2025-06-10 14:00:00+02',
                                        18.00,
                                        7.50 ),( 5,
                                                 '2025-06-10 15:30:00+02',
                                                 40.00,
                                                 18.00 ),( 6,
                                                           '2025-06-10 16:45:00+02',
                                                           55.00,
                                                           24.50 ),( 7,
                                                                     '2025-06-10 17:30:00+02',
                                                                     30.00,
                                                                     13.00 ),( 8,
                                                                               '2025-06-10 18:15:00+02',
                                                                               25.50,
                                                                               10.50 ),( 9,
                                                                                         '2025-06-10 19:00:00+02',
                                                                                         60.00,
                                                                                         26.00 ),( 10,
                                                                                                   '2025-06-10 20:00:00+02',
                                                                                                   45.50,
                                                                                                   20.00 ),( 11,
                                                                                                             '2024-12-01 09:30:00+02'
                                                                                                             ,
                                                                                                             0.00,
                                                                                                             0.00 );

-- Pozycje zamówień
insert into bufet_orderposition (
   position_id,
   amount,
   value,
   profit,
   order_id,
   product_id,
   unit_price
) values ( 1,
           2,
           7.00,
           3.00,
           1,
           1,
           3.50 ),( 2,
                    1,
                    6.00,
                    3.50,
                    1,
                    5,
                    6.00 ),( 3,
                             3,
                             6.00,
                             3.00,
                             2,
                             3,
                             2.00 ),( 4,
                                      1,
                                      5.00,
                                      3.00,
                                      2,
                                      6,
                                      5.00 ),( 5,
                                               1,
                                               4.50,
                                               2.50,
                                               2,
                                               10,
                                               4.50 ),( 6,
                                                        4,
                                                        10.00,
                                                        5.20,
                                                        3,
                                                        4,
                                                        2.50 ),( 7,
                                                                 1,
                                                                 6.50,
                                                                 3.50,
                                                                 3,
                                                                 12,
                                                                 6.50 ),( 8,
                                                                          1,
                                                                          3.00,
                                                                          2.00,
                                                                          4,
                                                                          9,
                                                                          3.00 ),( 9,
                                                                                   2,
                                                                                   8.00,
                                                                                   3.00,
                                                                                   4,
                                                                                   2,
                                                                                   4.00 ),( 10,
                                                                                            3,
                                                                                            11.40,
                                                                                            5.00,
                                                                                            5,
                                                                                            14,
                                                                                            3.80 ),( 11,
                                                                                                     2,
                                                                                                     4.40,
                                                                                                     2.00,
                                                                                                     5,
                                                                                                     15,
                                                                                                     2.20 ),( 12,
                                                                                                              1,
                                                                                                              5.50,
                                                                                                              3.30,
                                                                                                              5,
                                                                                                              16,
                                                                                                              5.50 ),( 13,
                                                                                                                       4,
                                                                                                                       26.00,
                                                                                                                       11.50,
                                                                                                                       6,
                                                                                                                       19,
                                                                                                                       6.50 )
                                                                                                                       ,( 14,
                                                                                                                        2,
                                                                                                                        8.00,
                                                                                                                        3.60,
                                                                                                                        6,
                                                                                                                        20,
                                                                                                                        4.00 )
                                                                                                                        ,( 15
                                                                                                                        ,
                                                                                                                         3,
                                                                                                                         16.50
                                                                                                                         ,
                                                                                                                         7.50
                                                                                                                         ,
                                                                                                                         6,
                                                                                                                         21,
                                                                                                                         5.50
                                                                                                                         ),( 16
                                                                                                                         ,
                                                                                                                          1,
                                                                                                                          3.50
                                                                                                                          ,
                                                                                                                          2.00
                                                                                                                          ,
                                                                                                                          7,
                                                                                                                          22,
                                                                                                                          3.50
                                                                                                                          ),(
                                                                                                                          17,
                                                                                                                           5,
                                                                                                                           30.00
                                                                                                                           ,
                                                                                                                           13.00
                                                                                                                           ,
                                                                                                                           7,
                                                                                                                           23
                                                                                                                           ,
                                                                                                                           6.00
                                                                                                                           ),
                                                                                                                           ( 18
                                                                                                                           ,
                                                                                                                            2
                                                                                                                            ,
                                                                                                                            9.00
                                                                                                                            ,
                                                                                                                            4.00
                                                                                                                            ,
                                                                                                                            8
                                                                                                                            ,
                                                                                                                            2
                                                                                                                            ,
                                                                                                                            4.50
                                                                                                                            )
                                                                                                                            ,
                                                                                                                            (
                                                                                                                            19
                                                                                                                            ,
                                                                                                                             1
                                                                                                                             ,
                                                                                                                             6.50
                                                                                                                             ,
                                                                                                                             3.50
                                                                                                                             ,
                                                                                                                             8
                                                                                                                             ,
                                                                                                                             12
                                                                                                                             ,
                                                                                                                             6.50
                                                                                                                             )
                                                                                                                             ,
                                                                                                                             (
                                                                                                                             20
                                                                                                                             ,
                                                                                                                              3
                                                                                                                              ,
                                                                                                                              9.00
                                                                                                                              ,
                                                                                                                              4.50
                                                                                                                              ,
                                                                                                                              9
                                                                                                                              ,
                                                                                                                              1
                                                                                                                              ,
                                                                                                                              3.00
                                                                                                                              )
                                                                                                                              ,
                                                                                                                              (
                                                                                                                              21
                                                                                                                              ,
                                                                                                                               2
                                                                                                                               ,
                                                                                                                               10.00
                                                                                                                               ,
                                                                                                                               4.00
                                                                                                                               ,
                                                                                                                               9
                                                                                                                               ,
                                                                                                                               4
                                                                                                                               ,
                                                                                                                               5.00
                                                                                                                               )
                                                                                                                               ,
                                                                                                                               (
                                                                                                                               22
                                                                                                                               ,
                                                                                                                                1
                                                                                                                                ,
                                                                                                                                7.00
                                                                                                                                ,
                                                                                                                                3.00
                                                                                                                                ,
                                                                                                                                10
                                                                                                                                ,
                                                                                                                                19
                                                                                                                                ,
                                                                                                                                7.00
                                                                                                                                )
                                                                                                                                ,
                                                                                                                                (
                                                                                                                                23
                                                                                                                                ,
                                                                                                                                 4
                                                                                                                                 ,
                                                                                                                                 10.00
                                                                                                                                 ,
                                                                                                                                 4.50
                                                                                                                                 ,
                                                                                                                                 10
                                                                                                                                 ,
                                                                                                                                 9
                                                                                                                                 ,
                                                                                                                                 2.50
                                                                                                                                 )
                                                                                                                                 ,
                                                                                                                                 (
                                                                                                                                 24
                                                                                                                                 ,
                                                                                                                                  2
                                                                                                                                  ,
                                                                                                                                  9.00
                                                                                                                                  ,
                                                                                                                                  3.80
                                                                                                                                  ,
                                                                                                                                  10
                                                                                                                                  ,
                                                                                                                                  6
                                                                                                                                  ,
                                                                                                                                  4.50
                                                                                                                                  )
                                                                                                                                  ;

select setval(
   pg_get_serial_sequence(
      'bufet_productcategory',
      'category_id'
   ),
   (
      select max(category_id)
        from bufet_productcategory
   )
);
select setval(
   pg_get_serial_sequence(
      'bufet_product',
      'product_id'
   ),
   (
      select max(product_id)
        from bufet_product
   )
);
select setval(
   pg_get_serial_sequence(
      'bufet_allergen',
      'allergen_id'
   ),
   (
      select max(allergen_id)
        from bufet_allergen
   )
);
select setval(
   pg_get_serial_sequence(
      'bufet_contactallergens',
      'in_allergen_id'
   ),
   (
      select max(in_allergen_id)
        from bufet_contactallergens
   )
);
select setval(
   pg_get_serial_sequence(
      'bufet_productstock',
      'stock_id'
   ),
   (
      select max(stock_id)
        from bufet_productstock
   )
);
select setval(
   pg_get_serial_sequence(
      'bufet_order',
      'order_id'
   ),
   (
      select max(order_id)
        from bufet_order
   )
);
select setval(
   pg_get_serial_sequence(
      'bufet_orderposition',
      'position_id'
   ),
   (
      select max(position_id)
        from bufet_orderposition
   )
);