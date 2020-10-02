package main

import (
	"reflect"
	"testing"
)

func TestUpdateYAML(t *testing.T) {
	t.Run("Given an empty YAML and no value, it returns the empty YAML", func(t *testing.T) {
		yamlString := ""
		updatedYAML, _ := UpdateYAML(yamlString)

		assertEqual(t, "{}\n", updatedYAML)
	})

	t.Run("Given an empty YAML and a key and no value, it returns the empty YAML", func(t *testing.T) {
		yamlString := ""
		updatedYAML, _ := UpdateYAML(yamlString, "key")

		assertEqual(t, "{}\n", updatedYAML)
	})

	t.Run("Given an empty YAML and a key and a value, it returns the YAML with that key and value", func(t *testing.T) {
		yamlString := ""
		updatedYAML, _ := UpdateYAML(yamlString, "key", "value")

		assertEqual(t, "key: value\n", updatedYAML)
	})

	t.Run("Given an YAML with values and a key and a value, it returns the YAML with that key and value apended", func(t *testing.T) {
		yamlString := "key1: value1\n"
		updatedYAML, _ := UpdateYAML(yamlString, "key2", "value2")

		assertEqual(t, ""+
			"key1: value1\n"+
			"key2: value2\n",
			updatedYAML)
	})

	t.Run("Given an YAML with values and an existing key and a value, it returns the YAML with the value updated", func(t *testing.T) {
		yamlString := "" +
			"key1: value1\n" +
			"key2: value2\n"
		updatedYAML, _ := UpdateYAML(yamlString, "key1", "value3")

		assertEqual(t, ""+
			"key1: value3\n"+
			"key2: value2\n",
			updatedYAML)
	})

	t.Run("Given more arguments, it puts the value in the hierarchy", func(t *testing.T) {
		yamlString := ""
		updatedYAML, _ := UpdateYAML(yamlString, "parent", "child", "value")

		assertEqual(t, ""+
			"parent:\n"+
			"  child: value\n",
			updatedYAML)
	})

	t.Run("Given and existent YAML and more than 3 arguments, it puts the value in the hierarchy keeping the previous values", func(t *testing.T) {
		yamlString := "" +
			"key1: value1\n" +
			"parent:\n" +
			"  child1: value1\n"

		updatedYAML, _ := UpdateYAML(yamlString, "parent", "child2", "value2")

		assertEqual(t, ""+
			"key1: value1\n"+
			"parent:\n"+
			"  child1: value1\n"+
			"  child2: value2\n",
			updatedYAML)
	})

	t.Run("Given a structure that colides with a value in the middle of the hierarchy, it overrides", func(t *testing.T) {
		yamlString := "" +
			"key1: value1\n" +
			"parent: child\n"

		updatedYAML, _ := UpdateYAML(yamlString, "parent", "child", "value")

		assertEqual(t, ""+
			"key1: value1\n"+
			"parent:\n"+
			"  child: value\n",
			updatedYAML)
	})

	t.Run("Given a structure with a hierarchy and a value that collides in the middle of the hierarchy, it overrides", func(t *testing.T) {
		yamlString := "" +
			"key1: value1\n" +
			"parent:\n" +
			"  child: value\n"

		updatedYAML, _ := UpdateYAML(yamlString, "parent", "value")

		assertEqual(t, ""+
			"key1: value1\n"+
			"parent: value\n",
			updatedYAML)
	})

	t.Run("works with structures of more than 3 levels", func(t *testing.T) {
		yamlString := ""

		updatedYAML, _ := UpdateYAML(yamlString, "key1", "key2", "key3", "value")

		assertEqual(t, ""+
			"key1:\n"+
			"  key2:\n"+
			"    key3: value\n",
			updatedYAML)
	})

	t.Run("Acceptance tests", func(t *testing.T) {
		yamlString := "" +
			"services:\n" +
			"  backend:\n" +
			"    env_file: .env\n" +
			"    environment:\n" +
			"      DB_HOST: postgres\n" +
			"      DB_NAME: markdown_notes\n" +
			"      DB_USERNAME: main\n" +
			"      LETSENCRYPT_HOST: api.notes.geisonbiazus.com\n" +
			"      VIRTUAL_HOST: api.notes.geisonbiazus.com\n" +
			"    image: geisonbiazus/markdown_notes_backend:alpha\n" +
			"    ports:\n" +
			"    - 4000:4000\n" +
			"    restart: always\n" +
			"  frontend:\n" +
			"    environment:\n" +
			"      LETSENCRYPT_HOST: notes.geisonbiazus.com\n" +
			"      REACT_APP_API_URL: https://api.notes.geisonbiazus.com\n" +
			"      REACT_APP_APP_ENV: production\n" +
			"      VIRTUAL_HOST: notes.geisonbiazus.com\n" +
			"    image: geisonbiazus/markdown_notes_frontend:alpha\n" +
			"    ports:\n" +
			"    - 3000:3000\n" +
			"    restart: always\n" +
			"  postgres:\n" +
			"    env_file: .env\n" +
			"    environment:\n" +
			"      POSTGRES_DB: markdown_notes\n" +
			"    image: postgres:12\n" +
			"    ports:\n" +
			"    - 5432:5432\n" +
			"    restart: always\n" +
			"    volumes:\n" +
			"    - ./volumes/postgres-data:/var/lib/postgresql/data\n" +
			"version: \"3.8\"\n"

		updatedYAML, _ := UpdateYAML(yamlString, "services", "backend", "image", "geisonbiazus/markdown_notes_backend:1234")

		assertEqual(t, ""+
			"services:\n"+
			"  backend:\n"+
			"    env_file: .env\n"+
			"    environment:\n"+
			"      DB_HOST: postgres\n"+
			"      DB_NAME: markdown_notes\n"+
			"      DB_USERNAME: main\n"+
			"      LETSENCRYPT_HOST: api.notes.geisonbiazus.com\n"+
			"      VIRTUAL_HOST: api.notes.geisonbiazus.com\n"+
			"    image: geisonbiazus/markdown_notes_backend:1234\n"+
			"    ports:\n"+
			"    - 4000:4000\n"+
			"    restart: always\n"+
			"  frontend:\n"+
			"    environment:\n"+
			"      LETSENCRYPT_HOST: notes.geisonbiazus.com\n"+
			"      REACT_APP_API_URL: https://api.notes.geisonbiazus.com\n"+
			"      REACT_APP_APP_ENV: production\n"+
			"      VIRTUAL_HOST: notes.geisonbiazus.com\n"+
			"    image: geisonbiazus/markdown_notes_frontend:alpha\n"+
			"    ports:\n"+
			"    - 3000:3000\n"+
			"    restart: always\n"+
			"  postgres:\n"+
			"    env_file: .env\n"+
			"    environment:\n"+
			"      POSTGRES_DB: markdown_notes\n"+
			"    image: postgres:12\n"+
			"    ports:\n"+
			"    - 5432:5432\n"+
			"    restart: always\n"+
			"    volumes:\n"+
			"    - ./volumes/postgres-data:/var/lib/postgresql/data\n"+
			"version: \"3.8\"\n",
			updatedYAML)

		updatedYAML, _ = UpdateYAML(yamlString, "services", "frontend", "image", "geisonbiazus/markdown_notes_frontend:4321")

		assertEqual(t, ""+
			"services:\n"+
			"  backend:\n"+
			"    env_file: .env\n"+
			"    environment:\n"+
			"      DB_HOST: postgres\n"+
			"      DB_NAME: markdown_notes\n"+
			"      DB_USERNAME: main\n"+
			"      LETSENCRYPT_HOST: api.notes.geisonbiazus.com\n"+
			"      VIRTUAL_HOST: api.notes.geisonbiazus.com\n"+
			"    image: geisonbiazus/markdown_notes_backend:alpha\n"+
			"    ports:\n"+
			"    - 4000:4000\n"+
			"    restart: always\n"+
			"  frontend:\n"+
			"    environment:\n"+
			"      LETSENCRYPT_HOST: notes.geisonbiazus.com\n"+
			"      REACT_APP_API_URL: https://api.notes.geisonbiazus.com\n"+
			"      REACT_APP_APP_ENV: production\n"+
			"      VIRTUAL_HOST: notes.geisonbiazus.com\n"+
			"    image: geisonbiazus/markdown_notes_frontend:4321\n"+
			"    ports:\n"+
			"    - 3000:3000\n"+
			"    restart: always\n"+
			"  postgres:\n"+
			"    env_file: .env\n"+
			"    environment:\n"+
			"      POSTGRES_DB: markdown_notes\n"+
			"    image: postgres:12\n"+
			"    ports:\n"+
			"    - 5432:5432\n"+
			"    restart: always\n"+
			"    volumes:\n"+
			"    - ./volumes/postgres-data:/var/lib/postgresql/data\n"+
			"version: \"3.8\"\n",
			updatedYAML)
	})
}

func assertEqual(t *testing.T, expected, actual interface{}) {
	t.Helper()
	if !reflect.DeepEqual(expected, actual) {
		t.Errorf("Values are not equal.\nExpected:\n%v\n\nActual:\n%v", expected, actual)
	}
}
