INSERT INTO customers( first_name, last_name, email_id, pass, phone_number, dob, city) VALUES 
	("Max","Verstappen","verstappenmax7@gmail.com","max123","4084121122","06121982","San Francisco"),
    ("Sebastian","Vettel","sebvettel@gmail.com","seb123","4081231953","09131992","San Jose"),
    ("Lando","Norris","lando66@gmail.com","lando123","6692015234","03021999","San Jose"),
    ("Carlos","Sainz","carlos.sainz@gmail.com","carlos123","4084321122","12271995","Palo Alto"),
    ("Lewis","Hamilton","lewis7xchampion@gmail.com","lewis123","6695567210","07171984","San Francisco");

-- INSERT INTO locations (location_name, state_name) VALUES
--     ('Los Angeles', 'California'),
--     ('San Francisco', 'California'),
--     ('San Diego', 'California'),
--     ('Mountain View', 'California'),
--     ('Sacramento', 'California'),
--     ('San Jose', 'California'),
--     ('Burbank', 'California'),
--     ('Sunnyvale', 'California'),
--     ('Palo Alto', 'California');

INSERT INTO restaurants (restaurant_name, owner_name, email_id, pass, phone_number, about, food_types) VALUES
("Jack in the Box", "Jack Smith", "jackinthebox@gmail.com","jack123", "+14081123239", "This place is so well-liked that it's one of the 3 most popular places for Fast Food delivery in all of San Jose. The Chicken Nuggets is one of the most-ordered items at this early morning go-to", "VEG, NON-VEG, VEGAN"),
("Carl's Jr.", "Bill Jones", "contactcarljr@gmail.com","bill4234","+14089692112",
 "Wondering what's the best thing to order here? The Crisscut Fries is one of the most ordered items among things on the menu and the Double Western Bacon Cheeseburger Combo and the Hand-Breaded Chicken Tenders are two of the items most commonly ordered together at this early morning go-to.", "NON-VEG");

INSERT INTO addresses (linked_ID, line1, city, state_name, zipcode, address_type) VALUES 
(1,"148 E San Carlos St", "San Jose", "California", "95112", "restaurant"),
(2, "1095 Oakland Rd", "San Jose", "California", "95112", "restaurant");
