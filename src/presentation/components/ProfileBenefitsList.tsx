/**
 * Profile Benefits List Component
 * Shows a list of benefits for anonymous users
 */

import React from "react";
import { View, StyleSheet } from "react-native";
import { AtomicText, AtomicIcon } from "@umituz/react-native-design-system";

export interface ProfileBenefitsListProps {
    benefits: string[];
}

export const ProfileBenefitsList: React.FC<ProfileBenefitsListProps> = ({ benefits }) => {

    return (
        <View style={styles.benefitsContainer}>
            {benefits.map((benefit, index) => (
                <View key={index} style={styles.benefitItem}>
                    <AtomicIcon name="Check" size="sm" color="primary" />
                    <AtomicText
                        type="bodyMedium"
                        color="secondary"
                        style={styles.benefitText}
                    >
                        {benefit}
                    </AtomicText>
                </View>
            ))}
        </View>
    );
};

const styles = StyleSheet.create({
    benefitsContainer: {
        marginBottom: 16,
        gap: 8,
    },
    benefitItem: {
        flexDirection: "row",
        alignItems: "flex-start",
        gap: 8,
    },
    benefitText: {
        flex: 1,
    },
});
