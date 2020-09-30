package main

import (
	"reflect"
	"testing"
)

func TestUpdateYAML(t *testing.T) {
	t.Run("Given an empty YAML and an empty key, it returns the empty YAML", func(t *testing.T) {
		yamlString := ""
		key := ""
		value := ""
		updatedYAML, _ := UpdateYAML(yamlString, key, value)

		assertEqual(t, "", updatedYAML)
	})

	t.Run("Given an empty YAML and a key and a value, it returns the YAML with that key and value", func(t *testing.T) {
		yamlString := ""
		key := "key"
		value := "value"
		updatedYAML, _ := UpdateYAML(yamlString, key, value)

		assertEqual(t, "key: value\n", updatedYAML)
	})

	t.Run("Given an YAML with values and a key and a value, it returns the YAML with that key and value apended", func(t *testing.T) {
		yamlString := "key1: value1\n"
		key := "key2"
		value := "value2"
		updatedYAML, _ := UpdateYAML(yamlString, key, value)

		assertEqual(t, ""+
			"key1: value1\n"+
			"key2: value2\n",
			updatedYAML)
	})

	t.Run("Given an YAML with values and an existing key and a value, it returns the YAML with the value updated", func(t *testing.T) {
		yamlString := "" +
			"key1: value1\n" +
			"key2: value2\n"
		key := "key1"
		value := "value3"
		updatedYAML, _ := UpdateYAML(yamlString, key, value)

		assertEqual(t, ""+
			"key1: value3\n"+
			"key2: value2\n",
			updatedYAML)
	})

	// t.Run("Given a more arguments, it puts the value in the hierarchy", func(t *testing.T) {
	// 	yamlString := ""
	// 	parent := "parent"
	// 	child := "child"
	// 	value := "value"
	// 	updatedYAML, _ := UpdateYAML(yamlString, parent, child, value)

	// 	assertEqual(t, ""+
	// 		"parent:\n"+
	// 		"  child: value\n",
	// 		updatedYAML)
	// })
}

func assertEqual(t *testing.T, expected, actual interface{}) {
	if !reflect.DeepEqual(expected, actual) {
		t.Errorf("Values are not equal.\nExpected: %v\n  Actual: %v", expected, actual)
	}
}
