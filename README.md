# Fantasy World API

A REST API for managing a fantasy realm with characters, quests, items, and worlds.

## **See it live:**

- Production: [https://fantasy-world-mongodb-api.vercel.app](https://fantasy-world-mongodb-api.vercel.app)
  You may need to refresh a couple of times before the server awakens.

---

## **Endpoints**

### **Worlds**

#### **GET /worlds**

Retrieve a list of all worlds.

**Response:**

```json
[
  {
    "_id": "675c299a308f20c14cc641f4",
    "name": "Middle Earth",
    "description": "A mystical land with elves, dwarves, and hobbits."
  }
]
```

---

### **Characters**

#### **GET /characters**

Retrieve a list of characters. Supports optional query parameters.

**Query Parameters:**

- `homeWorld`: Filter characters by their home world ID.
- `item`: Filter characters by the item they own.

**Example Request:**

```bash
GET /characters?homeWorld=675c299a308f20c14cc641f4&role=Hobbit
```

**Response:**

```json
[
  {
    "_id": "675c299a308f20c14cc641fa",
    "name": "Frodo Baggins",
    "role": "Hobbit",
    "homeWorld": {
      "_id": "675c299a308f20c14cc641f4",
      "name": "Middle Earth",
      "description": "A mystical land with elves, dwarves, and hobbits."
    },
    "quests": [
      {
        "_id": "675c299a308f20c14cc64202",
        "title": "Destroy the One Ring",
        "description": "Carry the One Ring to Mount Doom to save Middle Earth.",
        "reward": "Peace for Middle Earth"
      }
    ],
    "item": {
      "_id": "675c299a308f20c14cc6420c",
      "name": "Sting",
      "type": "Weapon"
    }
  }
]
```

#### **POST /characters**

Create a new character.

**Request Body:**

```json
{
  "name": "Aragorn",
  "role": "Ranger",
  "homeWorld": "675c299a308f20c14cc641f4",
  "item": "675c299a308f20c14cc6420d",
  "quests": ["675c299a308f20c14cc64202"]
}
```

**Response:**

```json
{
  "_id": "675c299a308f20c14cc64215",
  "name": "Aragorn",
  "role": "Ranger",
  "homeWorld": "675c299a308f20c14cc641f4",
  "item": "675c299a308f20c14cc6420d",
  "quests": ["675c299a308f20c14cc64202"]
}
```

---

### **Quests**

#### **GET /quests**

Retrieve a list of all quests.

**Response:**

```json
[
  {
    "_id": "675c299a308f20c14cc64202",
    "title": "Destroy the One Ring",
    "description": "Carry the One Ring to Mount Doom to save Middle Earth.",
    "reward": "Peace for Middle Earth",
    "assignedTo": ["675c299a308f20c14cc641fa", "675c299a308f20c14cc641fb"]
  }
]
```

---

### **Items**

#### **GET /items**

Retrieve a list of all items.

**Response:**

```json
[
  {
    "_id": "675c299a308f20c14cc6420c",
    "name": "Sting",
    "type": "Weapon",
    "owner": "675c299a308f20c14cc641fa"
  }
]
```

---

## **Error Handling**

All endpoints return standard HTTP status codes with an error message if something goes wrong.

**Example Error Response:**

```json
{
  "error": "Validation error",
  "details": [
    {
      "msg": "Name is required.",
      "param": "name",
      "location": "body"
    }
  ]
}
```
