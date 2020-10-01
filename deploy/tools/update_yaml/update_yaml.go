package main

import (
	"gopkg.in/yaml.v2"
)

func UpdateYAML(yamlString string, hierarchy ...string) (string, error) {
	parsedYAML := map[interface{}]interface{}{}

	err := yaml.Unmarshal([]byte(yamlString), &parsedYAML)
	if err != nil {
		return yamlString, err
	}

	parsedYAML = putIn(parsedYAML, hierarchy...)

	updatedYAML, err := yaml.Marshal(&parsedYAML)

	if err != nil {
		return yamlString, err
	}

	return string(updatedYAML), nil
}

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
