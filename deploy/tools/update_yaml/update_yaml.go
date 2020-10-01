package main

import (
	"gopkg.in/yaml.v2"
)

func UpdateYAML(yamlString string, hierarchy ...string) (string, error) {
	parsedYAML := map[interface{}]interface{}{}

	yaml.Unmarshal([]byte(yamlString), &parsedYAML)

	parsedYAML = putIn(parsedYAML, hierarchy...)

	updatedYAML, _ := yaml.Marshal(&parsedYAML)

	return string(updatedYAML), nil
}

// func putIn(parsedYAML map[interface{}]interface{}, hierarchy ...string) map[interface{}]interface{} {

// 	if len(hierarchy) == 2 {
// 		key := hierarchy[0]
// 		value := hierarchy[1]

// 		parsedYAML[key] = value
// 	} else if len(hierarchy) == 3 {
// 		key1 := hierarchy[0]
// 		key2 := hierarchy[1]
// 		value := hierarchy[2]

// 		if _, ok := parsedYAML[key1]; !ok {
// 			parsedYAML[key1] = map[interface{}]interface{}{}
// 		}

// 		if _, ok := parsedYAML[key1].(string); ok {
// 			parsedYAML[key1] = map[interface{}]interface{}{}
// 		}

// 		if node, ok := parsedYAML[key1].(map[interface{}]interface{}); ok {
// 			node[key2] = value
// 		}
// 	}

// 	return parsedYAML
// }
func putIn(node map[interface{}]interface{}, hierarchy ...string) map[interface{}]interface{} {
	if len(hierarchy) < 2 {
		return node
	}

	key := hierarchy[0]
	value := hierarchy[1]

	if len(hierarchy) == 2 {
		node[key] = value
	} else {
		nextNode := map[interface{}]interface{}{}

		if current, ok := node[key].(map[interface{}]interface{}); ok {
			nextNode = current
		}

		node[key] = putIn(nextNode, hierarchy[1:]...)
	}

	return node
}
