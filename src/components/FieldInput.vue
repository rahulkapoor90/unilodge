<template>
     <div class="control">
        <div class="control-label">
            <label>
                {{ field.label }}
                <template v-if="field.required"><b>*</b></template>
            </label>
        </div>
        <div class="control-input">
            <template v-if="field.options">
                <select v-model="field.value">
                    <template v-for="val in field.options">
                        <option :key="val.value" :value="val.value">{{ val.label }}</option>
                    </template>
                </select>
            </template>

            <template v-else-if="field.format === 'text'">
                <textarea  rows="3" v-model="field.value"></textarea>
            </template>

            <template v-else>
                <input type="text" v-model="field.value"/>
            </template>
        </div>
        <div class="control-hint" v-if="field.hint">
            <span>{{ field.hint }}</span>
        </div>
    </div>
</template>

<script>
//
// TODO:  Handle item.format values: country, date, phone, text
// TODO:  Handle item.type values: country, date, phone, text
//
export default {
    name: 'field-input',
    props: ['field'],
}
</script>