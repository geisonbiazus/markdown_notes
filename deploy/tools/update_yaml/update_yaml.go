package main

import (
	"gopkg.in/yaml.v2"
)

func UpdateYAML(yamlString string, hierarchy ...string) (string, error) {
	key := hierarchy[0]

	if key == "" {
		return yamlString, nil
	}

	parsedYAML := map[interface{}]interface{}{}

	yaml.Unmarshal([]byte(yamlString), &parsedYAML)

	putIn(parsedYAML, hierarchy...)

	updatedYAML, _ := yaml.Marshal(&parsedYAML)

	return string(updatedYAML), nil
}

func putIn(parsedYAML map[interface{}]interface{}, hierarchy ...string) map[interface{}]interface{} {
	// currentNode := parsedYAML

	// for _, key := range(hierarchy) {

	// }

	key := hierarchy[0]
	value := hierarchy[1]

	parsedYAML[key] = value

	return parsedYAML
}
